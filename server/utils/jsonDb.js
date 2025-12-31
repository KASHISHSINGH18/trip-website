const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Ensure db file exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], bookings: [], contacts: [] }, null, 2));
}

class JsonDb {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    readDb() {
        const data = fs.readFileSync(DB_PATH);
        return JSON.parse(data);
    }

    writeDb(data) {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    }

    async findOne(query) {
        const db = this.readDb();
        const collection = db[this.collectionName] || [];
        return collection.find(item => {
            for (let key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });
    }

    async find(query = {}) {
        const db = this.readDb();
        const collection = db[this.collectionName] || [];
        if (Object.keys(query).length === 0) return collection;
        
        return collection.filter(item => {
            for (let key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });
    }

    async findById(id) {
        return this.findOne({ _id: id });
    }

    async create(data) {
        const db = this.readDb();
        if (!db[this.collectionName]) db[this.collectionName] = [];
        
        const newItem = { 
            _id: Date.now().toString(), 
            createdAt: new Date(), 
            ...data 
        };
        db[this.collectionName].push(newItem);
        this.writeDb(db);
        return newItem;
    }
}

module.exports = JsonDb;
