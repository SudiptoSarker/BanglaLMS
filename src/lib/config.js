import sql from 'mssql';

const config = {
    user: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    server: process.env.NEXT_PUBLIC_DB_SERVER,
    database: process.env.NEXT_PUBLIC_DB_DATABASE,
    options: {
        encrypt: true, 
        enableArithAbort: true, 
    },
};

let pool;

export async function connectToDatabase() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
    }
    return pool;
  } catch (err) {
    console.error('Database connection failed: ', err);
    throw err;
  }
}

// export async function queryDatabase(query, params = []) {
//   try {
//     const pool = await connectToDatabase();
//     const request = pool.request();

//     params.forEach((param, index) => {
//       request.input(`param${index + 1}`, param);
//     });

//     const result = await request.query(query);
//     return result.recordset;
//   } catch (err) {
//     console.error('Query failed: ', err);
//     throw err;
//   }
// }

export async function queryDatabase(query, params = {}) {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    // Iterate over the key-value pairs in the params object
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value); // Use the key as the parameter name
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Query failed: ', err);
    throw err;
  }
}
