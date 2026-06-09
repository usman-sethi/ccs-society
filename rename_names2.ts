import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:password112@cluster0.dcs1kuc.mongodb.net/society?appName=Cluster0';

const nameMap: Record<string, string> = {
  "Hamza Saeed": "Harrison Scott",
  "Bilal Bacha": "Benjamin Barker",
  "M Ahmad": "Matthew Adams",
  "Muhammad Musa": "Michael Moore",
  "Kiran Noor": "Kathleen Nelson",
  "Maryam Hunain": "Mary Hunter",
  "Nimra Iqbal": "Nora Irwin",
  "Ajwa Aleema": "Abigail Adams",
  "Malak Zaryab Khan": "Mark Zachary",
  "Labeena Naseer": "Lauren Nash",
  "Gul Salam": "George Sullivan",
  "Jahan Zaib": "James Zander",
  "Ateequr Rehman": "Arthur Reed",
  "Abdul Nasir": "Anthony Nash",
  "Muhammad Nasir": "Matthew Nash",
  "Fajar Zeb": "Faith Zane",
  "Muhammad Hasher": "Michael Hayes",
  "Shaiza Abid Khan": "Sarah Abott"
};

const run = async () => {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection;
    const membersCollection = db.collection('members');
    const members = await membersCollection.find({}).toArray();
    
    for (const member of members) {
        if (nameMap[member.name]) {
            let bio = member.bio || "";
            // Replace names in bio as well
            bio = bio.replace(new RegExp(member.name, 'g'), nameMap[member.name]);
            await membersCollection.updateOne(
                { _id: member._id },
                { $set: { name: nameMap[member.name], bio: bio } }
            );
            console.log(`Updated ${member.name} to ${nameMap[member.name]}`);
        }
    }
    
    console.log('Done!');
    process.exit(0);
};

run().catch(console.error);
