import bcrypt from 'bcryptjs';

async function run() {
    const hash = await bcrypt.hash("admin123", 10);
    console.log("GENERATED HASH:", hash);
}

run();
