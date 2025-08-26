import Image from "next/image";
import { supabase } from "@/app/libr/supabaseClient";
import styles from "./productdetail.module.css";
import { getImageSrc } from "@/utils/getImageSrc";

// ✅ apna khud ka PageProps type define karo
type PageProps = {
  params: {
    id: string;
  };
};

export default async function ProductDetailPage({ params }: PageProps) {
  const productId = Number(params.id);

  const { data: product, error } = await supabase
    .from("productdetail")
    .select(`
      id,
      title,
      price,
      description,
      images,
      colours,
      sizes,
      stock,
      reviews_count,
      products ( id, name, price, image )
    `)
    .eq("id", productId)
    .single();

  if (!product || error) return <div>Error loading product</div>;

  const initialMainImage = getImageSrc(
    product.products?.[0]?.image || product.images?.[0]
  );

  const allImages = [
    ...(product.products?.map((p) => getImageSrc(p.image)) || []),
    ...(product.images?.map((img: string) => getImageSrc(img)) || []),
  ];

  return (
    <div className={styles.container}>
      {/* Left Thumbnails */}
      <div className={styles.leftColumn}>
        {allImages.map((img, idx) => (
          <div key={idx} className={styles.smallBox}>
            <Image src={img} alt={product.title} width={80} height={80} />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className={styles.mainImage}>
        <Image src={initialMainImage} alt={product.title} width={400} height={400} />
      </div>

      {/* Right Column */}
      <div className={styles.rightColumn}>
        <h2 className={styles.productTitle}>{product.title}</h2>
        <div className={styles.price}>₹{product.price}</div>
        <p className={styles.description}>{product.description}</p>
      </div>
    </div>
  );
}

