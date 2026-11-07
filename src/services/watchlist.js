
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase";

// ADD MOVIE
export async function addToWatchlist(userId, movie) {
  const watchlistRef = collection(db, "watchlist");

  const existingQuery = query(
    watchlistRef,
    where("userId", "==", userId),
    where("movieId", "==", movie.id)
  );

  const existing = await getDocs(existingQuery);

  if (!existing.empty) {
    return;
  }

  await addDoc(watchlistRef, {
    userId,
    movieId: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    overview: movie.overview || ""
  });
}

// GET USER WATCHLIST
export async function getWatchlist(userId) {
  const watchlistRef = collection(db, "watchlist");

  const q = query(
    watchlistRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

// REMOVE MOVIE
export async function removeFromWatchlist(documentId) {
  await deleteDoc(doc(db, "watchlist", documentId));
}
