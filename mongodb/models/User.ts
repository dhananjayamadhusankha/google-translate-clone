import mongoose, { Document, Schema } from "mongoose";
import connectDB from "../db";

export interface ITranslation extends Document {
  timestamp: Date;
  fromText: string;
  from: string;
  toText: string;
  to: string;
}

interface IUser extends Document {
  userId: string;
  translations: Array<ITranslation>;
}

const translationsSchema = new Schema<ITranslation>({
  timestamp: { type: Date, default: Date.now },
  fromText: String,
  from: String,
  toText: String,
  to: String,
});

const userSchema = new Schema({
  userId: { type: String, unique: true, required: true },
  translations: [translationsSchema],
});

// Check if the model already exists to prevent overwriting
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export async function addOrUpdateUser(
  userId: string,
  translation: {
    fromText: string;
    from: string;
    toText: string;
    to: string;
  }
): Promise<IUser | undefined> {
  const filter = { userId: userId };
  const update = {
    $set: { userId: userId },
    $push: { translations: translation, },
  };

  // Upsert option ensures that the document is created if it doesn't exist
  // The new: true option in the options object ensures that the method returns the updated document after the operation is complete. If you don't set new: true, the method will return the original document before the update.
  // In summary, the code you have will either update an existing user's document with new translations or create a new user document with the given userld, and translations, and save it into the database.
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  await connectDB();

  try {
    const user: IUser | null = await User.findOneAndUpdate(
      filter,
      update,
      options
    );

    console.log("User added or updated successfully: ", user);
    if (!user) {
      throw new Error("User not found and as not created");
    }
    return user;
  } catch (error) {
    console.error("Error ading or update user: ", error);
    return undefined;
  }
}

export async function getTranslations(
  userId: string
): Promise<Array<ITranslation> | undefined> {
  await connectDB();

  try {
    const user: IUser | null = await User.findOne({ userId: userId });

    if (user) {
      user.translations.sort(
        (a: ITranslation, b: ITranslation) =>
          b.timestamp.getTime() - a.timestamp.getTime()
      );
      return user.translations;
    } else {
      console.log(`User with user ID : ${userId} not found`);
      return [];
    }
  } catch (error) {
    console.error("Error retriving translations: ", error);
    throw error;
  }
}

export async function removeTranslation(
  userId: string,
  transationId: string
): Promise<IUser> {
  await connectDB();

  console.log("userId >>>>>", userId)
  console.log("transationId>>>>>>>", transationId)
  

  try {
    const user: IUser | null = await User.findOneAndUpdate(
      { userId: userId }, // Find the user with the given userid
      { $pull: { translations: { _id: transationId } } }, // Remove the translation with the given _id
      { new: true } // Return the updated document
    );

    if (!user) throw new Error("User not found");

    console.log("Translation is removed!: ", user);

    return user;
  } catch (error) {
    console.error("Error removing translations: ", error);
    throw error;
  }
}
