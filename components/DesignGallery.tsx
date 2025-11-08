// components/DesignGallery.tsx
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getDesigns, deleteDesign } from "@/lib/design/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

type Props = { userId: string };

export default function DesignGallery({ userId }: Props) {
  const [designs, setDesigns] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getDesigns(userId).then((data) => setDesigns(data));
  }, [userId]);

  const filteredDesigns = designs.filter((d: any) =>
    d.customizations.text?.toLowerCase().includes(search.toLowerCase()) ||
    d.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
  ).filter((d: any) => !filters.length || filters.every((f) => d.tags.includes(f)));

  const loadMore = () => {
    // Simulate pagination (in real: fetch next page)
    setPage((p) => p + 1);
    if (page > 3) setHasMore(false); // Mock limit
  };

  const handleDelete = async (id: string) => {
    await deleteDesign(id);
    setDesigns((prev) => prev.filter((d:any) => d.id !== id));
    toast('deleted');
  };

  const availableTags = [...new Set(designs.flatMap((d: any) => d.tags))];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Nike Designs</h1>
        <Link href="/customizer">
          <Button variant="default">+ New Design</Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search designs or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {availableTags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.includes(tag) ? "default" : "secondary"}
                  onClick={() => setFilters((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])}
                  className="cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Infinite Scroll Grid */}
      <InfiniteScroll
        dataLength={filteredDesigns.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Loading more designs...</p>}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredDesigns.map((d: any) => (
          <Card key={d.id} className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
            <Link href={`/customizer?load=${d.id}`} className="block">
              <Image
                src={d.previewImage}
                alt={d.customizations.text}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
              />
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">{d.customizations.text || "Untitled"}</CardTitle>
                <CardDescription className="flex flex-wrap gap-1 mt-2">
                  {d.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardDescription>
              </CardHeader>
            </Link>
            <CardContent className="p-4 pt-0 flex justify-between">
              <Link href={`/customizer?load=${d.id}`}>
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-4 w-4 mr-1" /> Edit
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </InfiniteScroll>

      {filteredDesigns.length === 0 && (
        <Card className="text-center p-12">
          <CardTitle>No designs match your search.</CardTitle>
          <p className="text-gray-500 mt-2">Try adjusting filters or create a new one!</p>
        </Card>
      )}
    </div>
  );
}