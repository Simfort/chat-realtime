import mysql from 'mysql2'

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
})

try {
    const res = await conn.query('CREATE DATABASE IF NOT EXISTS chatBase')
    console.log('Yeah  all okey')
} catch (e) {
    console.log('Base is create')
}   
