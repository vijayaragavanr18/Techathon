'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getWellnessProducts, WellnessProduct, getMedicines, Medicine } from '@/services/health';
import { Loader2, ShoppingCart, Search, Pill, Leaf } from 'lucide-react';
import Image from 'next/image'; // Import next/image
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MarketplacePage() {
  const [products, setProducts] = useState<WellnessProduct[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProducts(true);
      setIsLoadingMedicines(true);
      setError(null);
      try {
        const [productData, medicineData] = await Promise.all([
          getWellnessProducts(),
          getMedicines() // Fetching medicines to list them too
        ]);
        setProducts(productData);
        setMedicines(medicineData);
      } catch (err) {
        console.error("Failed to fetch marketplace data:", err);
        setError("Could not load products or medicines. Please try again later.");
      } finally {
        setIsLoadingProducts(false);
        setIsLoadingMedicines(false);
      }
    };
    fetchData();
  }, []);

   const handleAddToCart = (itemName: string) => {
     // TODO: Implement actual cart functionality
     console.log(`Adding ${itemName} to cart`);
     toast({
       title: "Item Added to Cart",
       description: `${itemName} has been added to your cart.`,
     });
   };

   const filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const filteredMedicines = medicines.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const isLoading = isLoadingProducts || isLoadingMedicines;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
         <ShoppingCart className="w-6 h-6" /> Marketplace
      </h1>
      <p className="text-muted-foreground">Purchase prescribed medicines and wellness products.</p>

      <div className="relative">
         <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
         <Input
           type="search"
           placeholder="Search products or medicines..."
           className="pl-8 w-full md:w-1/3"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {error && <p className="text-destructive text-center py-4">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
         <Tabs defaultValue="wellness">
            <TabsList className="grid w-full grid-cols-2 md:w-1/3">
              <TabsTrigger value="wellness">
                 <Leaf className="mr-1 h-4 w-4" /> Wellness Products
              </TabsTrigger>
              <TabsTrigger value="medicines">
                 <Pill className="mr-1 h-4 w-4" /> Medicines
              </TabsTrigger>
            </TabsList>
            <TabsContent value="wellness">
               {filteredProducts.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                   {filteredProducts.map((product, index) => (
                     <Card key={index} className="overflow-hidden flex flex-col">
                       <CardHeader className="p-0">
                         {/* Product Image */}
                         <Image
                           src={product.name === "Organic Nipple Cream" 
                             ? "/images/products/organic-nipple-cream.jpg"
                             : product.name === "Maternity Support Belt"
                             ? "/images/products/maternity-support-belt.jpg"
                             : product.name === "Stretch Mark Prevention Cream"
                             ? "/images/products/stretch-mark-cream.jpg"
                             : product.name === "Herbal Sitz Bath Soak"
                             ? "/images/products/herbal-sitz-bath.jpg"
                             : product.name === "Infant Probiotic Drops"
                             ? "/images/products/infant-probiotic-drops.jpg"
                             : `https://picsum.photos/seed/${product.name.replace(/\s+/g, '-')}/300/200`}
                           alt={product.name}
                           width={300}
                           height={200}
                           className="w-full h-40 object-cover"
                           priority={product.name === "Organic Nipple Cream" || 
                                   product.name === "Maternity Support Belt" || 
                                   product.name === "Stretch Mark Prevention Cream" ||
                                   product.name === "Herbal Sitz Bath Soak" ||
                                   product.name === "Infant Probiotic Drops"}
                         />
                       </CardHeader>
                       <CardContent className="pt-4 flex-grow">
                         <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                         <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                         <p className="font-semibold text-primary">${product.price.toFixed(2)}</p>
                       </CardContent>
                       <CardFooter>
                         <Button className="w-full" onClick={() => handleAddToCart(product.name)}>
                            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                         </Button>
                       </CardFooter>
                     </Card>
                   ))}
                 </div>
               ) : (
                 <p className="text-muted-foreground text-center py-10">No wellness products found matching your search.</p>
               )}
            </TabsContent>
             <TabsContent value="medicines">
                {filteredMedicines.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                    {filteredMedicines.map((medicine, index) => (
                      <Card key={index} className="overflow-hidden flex flex-col">
                        <CardHeader className="p-0">
                           {/* Medicine Image */}
                           <Image
                             src={medicine.name === "Prenatal Vitamins"
                               ? "/images/medicines/prenatal-vitamins.jpg"
                               : medicine.name === "Iron Supplement"
                               ? "/images/medicines/iron-supplement.jpg"
                               : medicine.name === "Folic Acid"
                               ? "/images/medicines/folic-acid.jpg"
                               : medicine.name === "Calcium + Vitamin D"
                               ? "/images/medicines/calcium-vitamin-d.jpg"
                               : `https://picsum.photos/seed/${medicine.name.replace(/\s+/g, '-')}/300/200`}
                             alt={medicine.name}
                             width={300}
                             height={200}
                             className="w-full h-40 object-cover"
                             priority={medicine.name === "Prenatal Vitamins" || 
                                     medicine.name === "Iron Supplement" || 
                                     medicine.name === "Folic Acid" ||
                                     medicine.name === "Calcium + Vitamin D"}
                           />
                        </CardHeader>
                        <CardContent className="pt-4 flex-grow">
                          <CardTitle className="text-lg mb-1">{medicine.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">Dosage: {medicine.dosage}</p>
                          <p className="text-sm text-muted-foreground">Frequency: {medicine.frequency}</p>
                           {/* Add price if available */}
                           {/* <p className="font-semibold text-primary">$Price</p> */}
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => handleAddToCart(medicine.name)}>
                             <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                          </Button>
                           {/* Consider adding prescription requirement note */}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-10">No medicines found matching your search.</p>
                )}
             </TabsContent>
         </Tabs>
      )}
    </div>
  );
}
