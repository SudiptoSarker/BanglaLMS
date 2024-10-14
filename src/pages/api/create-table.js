import { queryDatabase } from '@/lib/config';

export default async function handler(req, res) {
    // Parse the DEFAULT_TABLES from the environment variable
    const defaultTables = JSON.parse(process.env.DEFAULT_TABLES);

    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tableName, siteName, source, link, id, planner_id } = req.body;

    if (req.method === 'POST' || req.method === 'PUT') {
        if (!siteName || !source || !planner_id) {
            return res.status(400).json({ error: 'Site name, source, and planner_id are required' });
        }
    }

    // Ensure tableName and link are defined    
    const tableNameSafe = tableName ? `'${tableName}'` : 'NULL';
    const linkSafe = link ? `'${link}'` : 'NULL';
    const idSafe = id || 0;

    const checkTableExistsQuery = `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'SiteTable')
        BEGIN
            EXEC('
                CREATE TABLE [dbo].[SiteTable] (
                    [id] INT PRIMARY KEY IDENTITY(1,1),
                    [name] NVARCHAR(255) NOT NULL,
                    [source] NVARCHAR(255) NOT NULL,
                    [sourcetable] NVARCHAR(255) NULL,
                    [link] NVARCHAR(255) NULL,
                    [active] BIT NOT NULL,
                    [plannerid] INT NOT NULL 
                )
            ')
        END
    `;

    const insertValuesQuery = `
        INSERT INTO [dbo].[SiteTable] (name, source, sourcetable, link, active, plannerid)
        VALUES ('${siteName}', '${source}', ${tableNameSafe}, ${linkSafe}, 1, ${planner_id})
        SELECT SCOPE_IDENTITY() AS newId;  
    `;

    const updateValuesQuery = `
        UPDATE [dbo].[SiteTable]
        SET name = '${siteName}', source = '${source}', sourcetable = ${tableNameSafe}, link = ${linkSafe}, plannerid = ${planner_id}
        WHERE id = ${idSafe}
    `;

    try {
        // Ensure SiteTable exists
        await queryDatabase(checkTableExistsQuery);

        const checkExistsQuery = `
            SELECT LOWER([name]) AS name
            FROM [dbo].[SiteTable]
            WHERE active = 1 
            AND (LOWER([name]) = LOWER('${siteName}') AND [id] <> ${idSafe})
        `;

        const existingRecords = await queryDatabase(checkExistsQuery);
        const errors = {};

        existingRecords.forEach(record => {
            if (record.name === siteName.toLowerCase()) {
                errors.siteName = 'Site name already exists';
            }
        });

        if (Object.keys(errors).length > 0) {
            return res.status(409).json({ errors });
        }

        if (req.method === 'POST') {
            const result = await queryDatabase(insertValuesQuery);
            const newSiteId = result[0].newId;

            // Iterate over the defaultTables from the environment
            for (const defaultTable of Object.keys(defaultTables)) { // Get keys of defaultTables
                const newTableName = `${newSiteId}_${defaultTable}`;

                let copySchemaQuery = `
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'${newTableName}')
                    BEGIN
                        DECLARE @sql NVARCHAR(MAX);
                        SET @sql = 'CREATE TABLE [dbo].[${newTableName}] (';

                        SELECT @sql = @sql + 
                            CASE 
                                WHEN COLUMN_NAME = 'id' THEN 
                                    '[id] INT IDENTITY(1,1) PRIMARY KEY,'
                                ELSE 
                                    '[' + COLUMN_NAME + '] ' + 
                                    CASE 
                                        WHEN DATA_TYPE IN ('varchar', 'nvarchar') AND CHARACTER_MAXIMUM_LENGTH = -1 THEN 
                                            DATA_TYPE + '(MAX)' 
                                        WHEN CHARACTER_MAXIMUM_LENGTH IS NOT NULL AND CHARACTER_MAXIMUM_LENGTH <= 8000 THEN 
                                            DATA_TYPE + '(' + CAST(CHARACTER_MAXIMUM_LENGTH AS NVARCHAR(10)) + ')' 
                                        ELSE 
                                            DATA_TYPE 
                                    END +
                                    CASE 
                                        WHEN IS_NULLABLE = 'NO' THEN ' NOT NULL,' ELSE ',' END 
                            END
                        FROM INFORMATION_SCHEMA.COLUMNS 
                        WHERE TABLE_NAME = N'${defaultTable}';

                        SET @sql = LEFT(@sql, LEN(@sql) - 1); 
                        SET @sql = @sql + ');' 
                        
                        EXEC sp_executesql @sql;
                    END
                `;

                await queryDatabase(copySchemaQuery);
            }

            // Check if the source is 'DB' and create the new table dynamically
            if (source.toLowerCase() === 'db' && tableName) {
                const newTableName = `${newSiteId}_${tableName}`;
                const createDynamicTableQuery = `
                    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'${newTableName}')
                    BEGIN
                        CREATE TABLE [dbo].[${newTableName}] (
                            [id] INT PRIMARY KEY IDENTITY(1,1),
                            [licensekey] NVARCHAR(150) NOT NULL,
                            [ci] NVARCHAR(50) NOT NULL,
                            [validity] DATETIME NOT NULL,
                            [active] BIT NOT NULL
                        )
                    END
                `;
                await queryDatabase(createDynamicTableQuery);
            }
        } else if (req.method === 'PUT') {
            const currentRecordQuery = `
                SELECT sourcetable FROM [dbo].[SiteTable]
                WHERE id = ${idSafe}
            `;
            const currentRecord = await queryDatabase(currentRecordQuery);
            const previousSourcetable = currentRecord.length > 0 ? currentRecord[0].sourcetable : null;            
            const newTableName = `${idSafe}_${previousSourcetable}`;

            if (source.toLowerCase() === 'webapi' && previousSourcetable) {
                const dropTableQuery = `
                    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'${newTableName}')
                    BEGIN
                        DROP TABLE [dbo].[${newTableName}]
                    END
                `;
                await queryDatabase(dropTableQuery);
            }

            await queryDatabase(updateValuesQuery);

            if (source.toLowerCase() === 'db') {
                const newTableExistsQuery = `
                    SELECT * FROM INFORMATION_SCHEMA.TABLES 
                    WHERE TABLE_NAME = N'${tableName}'
                `;
                const newTableExists = await queryDatabase(newTableExistsQuery);

                if (newTableExists.length === 0) {
                    const createDynamicTableQuery = `
                        CREATE TABLE [dbo].[${tableName}] (
                            [id] INT PRIMARY KEY IDENTITY(1,1),
                            [licensekey] NVARCHAR(150) NOT NULL,
                            [ci] NVARCHAR(50) NOT NULL,
                            [validity] DATETIME NOT NULL,
                            [active] BIT NOT NULL
                        )
                    `;
                    await queryDatabase(createDynamicTableQuery);
                }
            }
        } else if (req.method === 'DELETE') {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: 'ID is required' });
            }

            const deactivateQuery = `
                UPDATE [dbo].[SiteTable]
                SET active = 0
                WHERE id = ${id}
            `;

            await queryDatabase(deactivateQuery);
            res.status(200).json({ message: 'Site deactivated successfully' });
            return;
        }

        res.status(200).json({ message: 'Operation completed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
