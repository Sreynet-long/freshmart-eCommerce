import { NextResponse } from "next/server";

// Example: return mock suggestions
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "All";

  // TODO: Replace with real DB / GraphQL call
  const suggestions = [
    { id: 1, name: "Cabbage", category: "Vegetable" },
    { id: 2, name: "Strawberry", category: "Fruit" },
  ].filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return NextResponse.json(suggestions);
}
