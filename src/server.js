import express from 'express'
import { ENV } from './config/env.js'
import { db } from './config/db.js'
import { favoritesTable } from './db/schema.js'
import { and, eq } from 'drizzle-orm';


const app = express()
const PORT = ENV.PORT || 5000

app.use(express.json())

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});



app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.error("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });

  }
});



// app.get("/api/favorites/:userID",async (req,res)=>{
//   try {


//     const {userId} = req.params;
//   const userFavorites =   await db.select().from(favoritesTable).where(eq(favoritesTable.userId,userId));
//   res.status(500).json(favoritesTable)
    
//   } catch (error) {
//       console.error("Error fetching the  favorite", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// })






app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.error("Error fetching the favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});













app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const userId = req.params.userId; 
    const recipeId = parseInt(req.params.recipeId); 

    const result = await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, recipeId)
        )
      );

 

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
  
    res.status(500).json({ error: "Something went wrong" });
  }
});









app.listen(PORT, () => {
  console.log("server is runing", PORT)
})