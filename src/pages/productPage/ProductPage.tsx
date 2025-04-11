import ProductSection from "./product-section";

// Sample product data - in a real app, this would come from an API or database
const sampleProduct = {
  id: "silver-pearl-necklace",
  title: "عقد فضة اصلي تصميم مع دمج اللؤلؤ الطبيعي",
  price: 190.54,
  originalPrice: 249,
  discount: 50,
  rating: 5,
  reviewCount: 32,
  description: `لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود تينسيدونت أوت لاوريت دولور ماجن. لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود تينسيدونت أوت لاوريت دولور ماجن. لوريم إيبسوم ألم سيت أميت، أديبي سكينج إليت لوريم إيبسوم ألم سيت أميت، كونسيكتيتور أديبي سكينج إليت لوريم إيبسوم ألم سيت أميت، كونسيكتيتور أديبي سكينج إليت`,
  images: [
    {
      alt: "Silver pearl necklace front view",
    },
    {
      alt: "Silver pearl necklace side view",
    },
    {
      alt: "Silver pearl necklace detail view",
    },
    {
      alt: "Silver pearl necklace worn",
    },
    {
      alt: "Silver pearl necklace packaging",
    },
  ],
  sizes: ["صغير", "متوسط", "كبير"],
  weights: ["2 جرام", "3 جرام", "4 جرام"],
};

/**
 * Product Detail Page
 * Displays a single product with all its details
 */
const ProductPage = () => {
  return (
    <div className=" font-display">
      <ProductSection product={sampleProduct} rtl={true} />
    </div>
  );
};

export default ProductPage;
