const fs = require('fs');
const path = require('path');
const os = require('os');

// Detect Vercel Environment
const IS_VERCEL = process.env.VERCEL === '1';

// Source file (in the repo)
const SOURCE_DB_PATH = path.join(__dirname, '../data/db.json');

// Target file (writable)
// On Vercel, we use /tmp. Locally, we use the repo file directly for persistence.
const DB_PATH = IS_VERCEL
    ? path.join(os.tmpdir(), 'db.json')
    : SOURCE_DB_PATH;

// Initialize
try {
    // If on Vercel and /tmp/db.json doesn't exist yet, copy from source
    if (IS_VERCEL) {
        if (!fs.existsSync(DB_PATH)) {
            if (fs.existsSync(SOURCE_DB_PATH)) {
                fs.copyFileSync(SOURCE_DB_PATH, DB_PATH);
                console.log('Copied Seed DB to /tmp');
            } else {
                fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], bookings: [], contacts: [] }, null, 2));
                console.log('Created new DB in /tmp');
            }
        }
    } else {
        // Local: Ensure directory and file exist
        if (!fs.existsSync(path.dirname(DB_PATH))) {
            fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
        }
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], bookings: [], contacts: [] }, null, 2));
        }
    }
} catch (error) {
    console.error("DB Init Error:", error);
}

class JsonDb {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    readDb() {
        try {
            if (!fs.existsSync(DB_PATH)) return { users: [], bookings: [], contacts: [] };
            const data = fs.readFileSync(DB_PATH);
            return JSON.parse(data);
        } catch (e) {
            console.error("Read Error:", e);
            return { users: [], bookings: [], contacts: [] };
        }
    }

    writeDb(data) {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        } catch (e) {
            console.error("Write Error:", e);
        }
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
