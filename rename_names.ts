import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:password112@cluster0.dcs1kuc.mongodb.net/society?appName=Cluster0';

const nameMap: Record<string, string> = {
  "Waleed Ahmad": "William Adams",
  "Nabeela Sabir": "Natalie Smith",
  "Sayed Khurram": "Samuel Kent",
  "Warisha Sikandri": "Wendy Sinclair",
  "Muhammad Ahmad": "Matthew Anderson",
  "Malayeka Javed": "Mary Jones",
  "Ahmad Ali": "Alexander Allen",
  "Salman Afridi": "Steven Abbott",
  "M Hassam Khan": "Michael Harris",
  "Hasnain Iqbal": "Henry Irvine",
  "Muhammad Saad": "Mitchell Scott",
  "Faisal": "Franklin Ford",
  "Haris Khan": "Harrison Clark",
  "Maida": "Megan Miller",
  "Ameer Hamza": "Andrew Hughes",
  "Hafsa": "Hannah Hill",
  "Hilal Munir": "Hilary Murphy",
  "Surveying Univ of Pesh": "University Developer"
};

const run = async () => {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    
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
    
    const devsCollection = db.collection('developers');
    const devs = await devsCollection.find({}).toArray();
    for (const dev of devs) {
        if (nameMap[dev.name]) {
            let bio = dev.bio || "";
            bio = bio.replace(new RegExp(dev.name, 'g'), nameMap[dev.name]);
            await devsCollection.updateOne(
                { _id: dev._id },
                { $set: { name: nameMap[dev.name], bio: bio } }
            );
            console.log(`Updated Developer ${dev.name} to ${nameMap[dev.name]}`);
        }
    }
    
    console.log('Done!');
    process.exit(0);
};

run().catch(console.error);
