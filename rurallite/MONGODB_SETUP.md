# MongoDB Setup Guide for RuralLite

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier (512MB storage)

2. **Create a Cluster**
   - Choose "Shared" (Free tier)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Username: `rurallite`
   - Password: `yourSecurePassword123`
   - Select "Read and write to any database"

4. **Whitelist IP Address**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, use specific IP addresses

5. **Get Connection String**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://rurallite:<password>@cluster0.xxxxx.mongodb.net/rurallite
   ```
   - Replace `<password>` with your actual password

6. **Update .env.local**
   ```env
   DATABASE_URL="mongodb+srv://rurallite:yourSecurePassword123@cluster0.xxxxx.mongodb.net/rurallite?retryWrites=true&w=majority"
   ```

---

### Option 2: Local MongoDB (Development)

#### Windows Installation

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows version
   - Download MSI installer

2. **Install MongoDB**
   - Run installer
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   # MongoDB should start automatically as service
   # To manually start:
   net start MongoDB
   ```

5. **Update .env.local**
   ```env
   DATABASE_URL="mongodb://localhost:27017/rurallite"
   ```

#### Using Docker (Cross-platform)

1. **Create docker-compose.yml** (Already exists in root)
   ```yaml
   services:
     mongodb:
       image: mongo:7
       container_name: rurallite-mongodb
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: admin123
         MONGO_INITDB_DATABASE: rurallite
       volumes:
         - mongodb_data:/data/db
   
   volumes:
     mongodb_data:
   ```

2. **Start MongoDB Container**
   ```bash
   docker-compose up -d mongodb
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL="mongodb://admin:admin123@localhost:27017/rurallite?authSource=admin"
   ```

---

## Setup Prisma with MongoDB

1. **Install Dependencies** (Already done)
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Push Schema to MongoDB**
   ```bash
   npx prisma db push
   ```
   This creates collections in MongoDB based on your schema.

4. **Seed Database**
   ```bash
   npm run prisma:seed
   ```

5. **View Data with Prisma Studio**
   ```bash
   npx prisma studio
   ```
   Opens GUI at http://localhost:5555

---

## MongoDB vs PostgreSQL Key Differences

### Schema Changes
- **PostgreSQL**: Uses `@id @default(autoincrement())` with `Int` type
- **MongoDB**: Uses `@id @default(auto()) @map("_id") @db.ObjectId` with `String` type

### IDs
- **PostgreSQL**: Sequential integers (1, 2, 3...)
- **MongoDB**: ObjectIds (24-character hex strings like `507f1f77bcf86cd799439011`)

### Indexes
- **PostgreSQL**: Requires explicit `@@index([field])` declarations
- **MongoDB**: Automatically creates index on `_id`, others optional

### Relations
- MongoDB doesn't enforce referential integrity at database level
- Prisma handles relationships through schema definitions

---

## Verify MongoDB Connection

### Check Connection in Node.js
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ MongoDB connected successfully!');
    
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

### Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017` (for local)
3. Click "Connect"
4. View `rurallite` database and collections

### Using mongosh (CLI)
```bash
mongosh mongodb://localhost:27017

# Switch to database
use rurallite

# Show all collections
show collections

# Query users
db.User.find()

# Count documents
db.Lesson.countDocuments()
```

---

## Common Issues & Solutions

### Issue 1: "MongoServerError: Authentication failed"
**Solution:**
- Check username and password in connection string
- Ensure MongoDB user has proper permissions
- For Atlas, verify IP is whitelisted

### Issue 2: "Error: P1001: Can't reach database server"
**Solution:**
- Verify MongoDB is running: `net start MongoDB` (Windows)
- Check port 27017 is not blocked by firewall
- Test connection: `mongosh mongodb://localhost:27017`

### Issue 3: "Module not found: @prisma/client"
**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

### Issue 4: "Invalid `prisma.user.create()` invocation"
**Solution:**
- Regenerate Prisma client: `npx prisma generate`
- Check schema syntax: `npx prisma format`
- Push schema: `npx prisma db push`

---

## Production Deployment Checklist

✅ Use MongoDB Atlas for managed hosting  
✅ Enable authentication (username/password)  
✅ Whitelist only application server IPs  
✅ Use connection pooling (`?poolSize=10`)  
✅ Enable SSL/TLS encryption  
✅ Set up automated backups  
✅ Monitor database performance  
✅ Use environment variables for connection string  
✅ Never commit .env files to git  

---

## MongoDB Atlas Free Tier Limits

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: Up to 500 concurrent
- **Backup**: Automated backups not included (manual exports)
- **Good for**: Development, small projects, prototypes

For production with more traffic, consider upgrading to M2+ ($9/month).

---

## Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to MongoDB
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio

# Seed database
npm run prisma:seed

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# View database structure
npx prisma db pull
```

---

## Resources

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **MongoDB Docs**: https://www.mongodb.com/docs/
- **Prisma MongoDB Guide**: https://www.prisma.io/docs/concepts/database-connectors/mongodb
- **MongoDB University** (Free Courses): https://university.mongodb.com/
