// File: src/app/supplier/products/page.js

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash, Eye, ArrowUp, ArrowDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddProductDialog from "@/components/supplier/product/AddProductDialog";
import EditProductDialog from "@/components/supplier/product/EditProductDialog";
import DetailProductDialog from "@/components/supplier/product/DetailProductDialog";
import { getSupplierByUserID } from "@/apiServices/suppliers/page";
import { deleteProduct, getProductBySupplierID } from "@/apiServices/products/page";
import { useNotification } from "@/apiServices/NotificationService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notify = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const itemsPerPage = 10;
  useEffect(() => {
    const fetchSupplier = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      try {
        const user = JSON.parse(userData);
        const supplier = await getSupplierByUserID(user.id);
        setSupplierID(supplier.id);
      } catch (error) {
        console.error("Fetch supplier error:", error);
      }
    };

    fetchSupplier();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supplierID) return;
      setIsLoading(true)
      try {
        const products = await getProductBySupplierID(supplierID);
        setProducts(products);
      } catch (error) {
        console.error("Fetch products error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [supplierID]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFilteredProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = (sortedFilteredProducts || []).slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleEditProduct = (updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProduct.id);

      const updatedProducts = products.filter(
        (product) => product.id !== selectedProduct.id
      );

      setProducts(updatedProducts);
      setIsDeleteDialogOpen(false);

      notify("Product deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      notify("Failed to delete product! ❌", "error");
    }
  };


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Product</Button>
      </div>

      <div className="flex items-center mb-6">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {["name", "category", "price", "quantity"].map(
                (key) => (
                  <TableHead
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortConfig.key === key &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUp className="inline ml-1" />
                      ) : (
                        <ArrowDown className="inline ml-1" />
                      ))}
                  </TableHead>
                )
              )}
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading products...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentProducts.length > 0 ? (
              currentProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price.toLocaleString()} VND</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {[...new Set(product.sizes?.map((size) => size.name))].join(
                      ", "
                    )}
                  </TableCell>
                  <TableCell>
                    {[
                      ...new Set(product.colors?.map((color) => color.name)),
                    ].join(", ")}
                  </TableCell>
                  <TableCell>
                    {[
                      ...new Set(
                        product.discounts?.map(
                          (discount) => `${Math.round(discount.percentage)}%`
                        )
                      ),
                    ].join(", ")}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center items-center mt-4 space-x-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      <AddProductDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />

      <EditProductDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditProduct}
        product={selectedProduct}
      />

      <DetailProductDialog
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
