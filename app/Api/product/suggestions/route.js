import { NextResponse } from "next/server";

// Example: return mock suggestions
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "All";

  // TODO: Replace with real DB / GraphQL call
  const suggestions = [
    { id: 1, name: "Vitamin C", category: "Health" },
    { id: 2, name: "Vinegar", category: "Cooking" },
  ].filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json(suggestions);
}
