const calltoApi = async (query, values) => {
    try {
        const response = await fetch("/api/db", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ query, values }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};


export const testCall = async () => {
    const query = `SELECT  * FROM SiteTable`;
    const values = [];
    return await calltoApi(query, values);
};

/**
 * Escapes SQL identifiers by wrapping them in square brackets.
 * This prevents SQL syntax errors when identifiers start with numbers or contain special characters.
 * @param {string} identifier - The SQL identifier to escape.
 * @returns {string} - The escaped identifier.
 */
const escapeIdentifier = (identifier) => {
    if (typeof identifier !== 'string') {
        throw new Error("Identifier must be a string.");
    }
    // Replace any closing square brackets with double brackets to escape them
    return `[${identifier.replace(/]/g, ']]')}]`;
};

/**
 * Creates a new table in the database with the specified columns.
 * @param {string} tableName - The name of the table to create.
 * @param {Array} columnList - An array of column definitions. Each column should have 'value' and 'type'.
 * @param {number|string} sitePrimaryKey - The primary key of the related site, used to prefix the table name.
 * @returns {Promise} - Resolves with the API response or rejects with an error.
 */
export const createTable = async (tableName, columnList, sitePrimaryKey) => {
    try {
        // **1. Input Validation**
        if (!tableName || typeof tableName !== 'string') {
            throw new Error("Invalid table name provided.");
        }

        if (
            sitePrimaryKey === undefined ||
            sitePrimaryKey === null ||
            (typeof sitePrimaryKey !== 'number' && typeof sitePrimaryKey !== 'string')
        ) {
            throw new Error("Invalid sitePrimaryKey provided. It must be a number or string.");
        }

        if (!Array.isArray(columnList) || columnList.length === 0) {
            throw new Error("Column list must be a non-empty array.");
        }

        // **2. Filter Out 'id' and 'siteid' Columns to Prevent Duplication**
        const filteredColumns = columnList.filter(column => 
            column.value.toLowerCase() !== 'id' && column.value.toLowerCase() !== 'siteid'
        );

        // **3. Construct the Escaped Table Name**
        const escapedTableName = escapeIdentifier(`${sitePrimaryKey}_${tableName}`);

        // **4. Start Building the CREATE TABLE Query**
        let query = `CREATE TABLE ${escapedTableName} (
            id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
            siteid INT, `;

        // **5. Iterate Through Filtered Columns and Append Definitions**
        for (let i = 0; i < filteredColumns.length; i++) {
            const column = filteredColumns[i];

            // **a. Validate Column Structure**
            if (!column.value || !column.type) {
                throw new Error(`Column at index ${i} is missing 'value' or 'type'.`);
            }

            // **b. Escape Column Name**
            const escapedColumnName = escapeIdentifier(column.value);

            // **c. Append Column Definition**
            query += `${escapedColumnName} ${column.type}, `;
        }

        // **6. Remove Trailing Comma and Space, Then Close the Statement**
        query = query.replace(/,\s*$/, "");
        query += ")";

        // **7. Logging the Generated SQL Query for Debugging**
        console.log("Generated SQL Query:", query);

        // **8. Execute the Query via API**
        const values = []; // Assuming no parameters are needed for the table creation
        return await calltoApi(query, values);
    } catch (error) {
        console.error("Error creating table:", error.message);
        throw error; // Re-throw the error after logging
    }
};

export const getTableList = async (sitePrimaryKey) => {
    try {
        // **1. Construct the SQL Query**
        const query = `
            SELECT 
                t.TABLE_NAME, 
                t.TABLE_TYPE, 
                o.create_date
            FROM 
                INFORMATION_SCHEMA.TABLES t
            JOIN 
                sys.objects o ON t.TABLE_NAME = o.name
            WHERE 
                t.TABLE_TYPE = 'BASE TABLE' 
                AND t.TABLE_NAME LIKE '${sitePrimaryKey}[_]%'
            ORDER BY 
                o.create_date DESC;
        `;

        // **2. Empty Values Array if Substituting Directly**
        const values = [];

        // **3. Call the API with the Query and Values**
        return await calltoApi(query, values);
    } catch (error) {
        console.error("Error fetching table list:", error.message);
        throw error;
    }
};



export const getColumnList = async (tableName, sitePK) => {
    // Construct the dynamic table name
    const formattedTableName = `${sitePK}_${tableName}`;

    // Create the SQL query using the formatted table name
    const query = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'${formattedTableName}'`;
    
    const values = []; // No additional values needed for this query
    return await calltoApi(query, values);
};


export const dropTable = async (tableName, sitePK) => {
    const formattedTableName = `${sitePK}_${tableName}`;
    const query = `DROP TABLE [${formattedTableName}]`; // Use square brackets for safety
    const values = [];
    return await calltoApi(query, values);
};

export const cloneTable = async (oldTableName, newTableName, withData, sitePK) => {
    const formattedOldTableName = `[${sitePK}_${oldTableName}]`;
    const formattedNewTableName = `[${newTableName}]`;
    
    let query = '';

    if (withData) {
        query = `SELECT * INTO ${formattedNewTableName} FROM ${formattedOldTableName}`;
    } else {
        query = `SELECT TOP 0 * INTO ${formattedNewTableName} FROM ${formattedOldTableName}`; 
    }

    const values = [];
    return await calltoApi(query, values);
};

export const insertDataIntoTable = async (tableName,columnList) => {
    let query = `insert into [${tableName}] (`;
    
    // add columns

        for(let x=0; x<columnList.length;x++){
            if(columnList[x].columnName!='id'){
                query += `${columnList[x].columnName},`;
            }
        }
        query = query.slice(0,-1);
        query += ') values (';
    // add values
        for(let x=0; x<columnList.length;x++){
            if(columnList[x].columnName!='id'){
                if(columnList[x].dataType.includes('varchar')){
                    query += `'${columnList[x].value}',`;
                }
                else{
                    query += `${columnList[x].value},`;
                }
                
            }
        }
        query = query.slice(0,-1);
        query += ')';

    
    const values = [];
    return await calltoApi(query, values);
    //return query;
};

export const getTableData = async (tableName) => {
    const query = `select * from [${tableName}]`;
    const values = [];
    return await calltoApi(query, values);
};

export const updateTableData = async (tableName,columnList) => {

    let id = 0;
    let query = `update [${tableName}] set `;
    for(let column of columnList){
        if(column.columnName!='id'){
            if(column.dataType.includes('varchar')){
                query += `${column.columnName} = '${column.value}',`;
            }else{
                query += `${column.columnName} = ${column.value},`;
            }
        }
        else{
            id = column.value;
        }

        
    }
    query = query.slice(0,-1);
    query += ` where id = ${id}`;

    const values = [];
    return await calltoApi(query, values);
};

export const deleteTableData = async (tableName,rowId) => {
    const query = `delete from [${tableName}] where id = ${rowId}`;
    const values = [];
    return await calltoApi(query, values);
};

// export const fetchSubscriptionData = async (sitename,sectionname) => {
//     let siteIdQuery = ``;
//     const query = `SELECT * FROM buttondata where section='subscriptionbutton'`;
//     const values = [];
//     return await calltoApi(query,values);
// };
export const getSiteId = async (domain) => {
    const siteIdQuery = `SELECT id FROM [dbo].[sites] WHERE name LIKE '%${domain}'`;
    const siteIdResult =  await calltoApi(siteIdQuery);    
    return siteIdResult;    
}

export const getSubscribedData = async (siteid, muid) => {
    const query = `SELECT * FROM [dbo].[membertable] WHERE siteid='${siteid}' AND muid='${muid}' AND status=1`;
    return await calltoApi(query,[]);
}

export const fetchSubscriptionLoginData = async (siteId, sectionname) => {
    try {
        if (!siteId) {
            throw new Error(`Site with name '${sitename}' not found.`);
        }

        // Step 2: Use the site id to fetch the subscription data
        const subscriptionQuery = `SELECT * FROM [dbo].[${siteId}_subscriptiondata] WHERE section = '${sectionname}'`;
        
        const subscriptionResult = await calltoApi(subscriptionQuery);

        // Return the subscription data
        return subscriptionResult;

    } catch (error) {
        console.error('Error fetching subscription data:', error);
        throw error;
    }
};

export const fetchNotificationsAndAnnouncements = async (siteId, sectionname) => {
    const query = `SELECT * FROM [dbo].[${siteId}_textlinks] WHERE section = '${sectionname}'`;    
    const values = [];
    return await calltoApi(query,values);
};