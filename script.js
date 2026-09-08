const SUPABASE_URL = "https://hlnbnczvmdgqsaldfqyw.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZIO0-w4_OIfsS1DumgaMJQ_Z_G5DIvV";

const { createClient } = supabase;

const db = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function displayProducts() {

  const container = document.getElementById("productsContainer");

  if (!container) return;

  container.innerHTML = "<p>جاري تحميل المنتجات...</p>";

  const { data, error } = await db
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p>حدث خطأ في تحميل المنتجات</p>";
    return;
  }

  container.innerHTML = "";

  data.forEach(product => {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = 
      <img 
        src="${product.image_url || 'https://via.placeholder.com/300x300?text=ARONIA'}"
        alt="${product.name}"
      >

      <h3>${product.name}</h3>

      <p>${product.description || ""}</p>

      <strong>${product.price} د.ع</strong>

      <button onclick="addToCart(${product.id})">
        أضيفي للسلة
      </button>
    ;

    container.appendChild(card);

  });
}
