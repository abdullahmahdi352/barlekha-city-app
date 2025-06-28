import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Star, PlusCircle, Trash2, Pencil, Map } from "lucide-react";

export default function BarlekhaCityApp() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [listings, setListings] = useState([
    {
      name: "Barlekha General Hospital",
      category: "Health",
      address: "Station Road, Barlekha",
      phone: "01700-000000",
      rating: 4.5,
      lat: 24.7028,
      lng: 91.8225,
      image: "https://via.placeholder.com/300x150?text=Hospital"
    },
    {
      name: "Cafe Barlekha",
      category: "Restaurant",
      address: "College Road, Barlekha",
      phone: "01700-111111",
      rating: 4.2,
      lat: 24.7051,
      lng: 91.8199,
      image: "https://via.placeholder.com/300x150?text=Cafe"
    }
  ]);

  const [newListing, setNewListing] = useState({
    name: "",
    category: "",
    address: "",
    phone: "",
    rating: "",
    image: "",
    lat: "",
    lng: ""
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddListing = () => {
    if (newListing.name && newListing.category) {
      const formattedListing = {
        ...newListing,
        rating: parseFloat(newListing.rating),
        lat: parseFloat(newListing.lat),
        lng: parseFloat(newListing.lng)
      };

      if (editingIndex !== null) {
        const updatedListings = [...listings];
        updatedListings[editingIndex] = formattedListing;
        setListings(updatedListings);
        setEditingIndex(null);
      } else {
        setListings([...listings, formattedListing]);
      }
      setNewListing({ name: "", category: "", address: "", phone: "", rating: "", image: "", lat: "", lng: "" });
    }
  };

  const handleDeleteListing = (index) => {
    const updated = [...listings];
    updated.splice(index, 1);
    setListings(updated);
  };

  const handleEditListing = (index) => {
    const place = listings[index];
    setNewListing({
      name: place.name,
      category: place.category,
      address: place.address,
      phone: place.phone,
      rating: place.rating.toString(),
      image: place.image || "",
      lat: place.lat?.toString() || "",
      lng: place.lng?.toString() || ""
    });
    setEditingIndex(index);
  };

  const categories = ["All", ...new Set(listings.map(l => l.category))];

  const filteredListings = listings.filter(
    (l) =>
      (selectedCategory === "All" || l.category === selectedCategory) &&
      (l.name.toLowerCase().includes(search.toLowerCase()) ||
       l.category.toLowerCase().includes(search.toLowerCase())) &&
      l.rating >= minRating
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <Input
          placeholder="Search services or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <select
          className="border rounded-md px-3 py-2 text-sm md:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border rounded-md px-3 py-2 text-sm md:w-1/4"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
        >
          {[0, 3, 3.5, 4, 4.5, 5].map((rating, idx) => (
            <option key={idx} value={rating}>{`Min Rating: ${rating}+`}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((place, index) => (
          <Card key={index} className="relative rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <CardContent className="p-4">
              {place.image && (
                <img src={place.image} alt={place.name} className="rounded-xl mb-3 w-full h-36 object-cover" />
              )}
              <div className="text-xl font-semibold mb-1">{place.name}</div>
              <div className="text-sm text-gray-600 mb-2">{place.category}</div>
              <div className="flex items-center text-sm mb-1">
                <MapPin className="w-4 h-4 mr-1" /> {place.address}
              </div>
              <div className="text-sm text-blue-600 mb-1">
                🌍 Lat: {place.lat} | Lng: {place.lng}
              </div>
              <div className="text-sm text-blue-500 mb-2">
                <a
                  href={`https://maps.google.com/?q=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline flex items-center gap-1"
                >
                  <Map className="w-4 h-4" /> View on Map
                </a>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Phone className="w-4 h-4 mr-1" /> {place.phone}
              </div>
              <div className="flex items-center text-sm text-yellow-500">
                <Star className="w-4 h-4 mr-1" /> {place.rating} / 5
              </div>
              <Button className="mt-4 w-full">Call Now</Button>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditListing(index)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteListing(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded-2xl shadow-inner">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> {editingIndex !== null ? "Edit Listing" : "Add New Listing"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Name"
            value={newListing.name}
            onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={newListing.category}
            onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={newListing.address}
            onChange={(e) => setNewListing({ ...newListing, address: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={newListing.phone}
            onChange={(e) => setNewListing({ ...newListing, phone: e.target.value })}
          />
          <Input
            placeholder="Rating (0-5)"
            value={newListing.rating}
            onChange={(e) => setNewListing({ ...newListing, rating: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newListing.image}
            onChange={(e) => setNewListing({ ...newListing, image: e.target.value })}
          />
          <Input
            placeholder="Latitude"
            value={newListing.lat}
            onChange={(e) => setNewListing({ ...newListing, lat: e.target.value })}
          />
          <Input
            placeholder="Longitude"
            value={newListing.lng}
            onChange={(e) => setNewListing({ ...newListing, lng: e.target.value })}
          />
        </div>
        <Button className="mt-3" onClick={handleAddListing}>
          {editingIndex !== null ? "Update Listing" : "Add Listing"}
        </Button>
      </div>
    </div>
  );
}
