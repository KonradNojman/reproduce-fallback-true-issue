import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
// import { Layout } from "../../components/Layout";
import { Pagination } from "../../components/Pagination";
// import { ProductListItem } from "../../components/ProductListItem";

const PRODUCT_PAGES = 150;
const MAX_PRODUCT_PAGES_TO_PRERENDER = 20;
const PRODUCTS_PER_PAGE = 25;
export interface StoreApiResponse {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: Rating;
  image: string;
  longDescription: string;
}

interface Rating {
  rate: number;
  count: number;
}

const ProductsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  // @todo why it only goes to fallback only once and when moving to different sites it doesn't show loading every time?
  const router = useRouter();
  if (router.isFallback) {
    console.log("isFallback", router.isFallback);

    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="my-6 flex">
        <Pagination
          currentPage={Number(props.pageNumber)}
          itemsAmount={PRODUCT_PAGES * PRODUCTS_PER_PAGE}
          itemsPerPage={PRODUCTS_PER_PAGE}
          redirectUrl="/products"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        some shop products
      </div>
    </>
  );
};

export const getStaticProps = async ({
  params,
}: InferGetStaticPaths<typeof getStaticPaths>) => {
  const { pageNumber = "1" } = params || {};
  const offset = (Number(pageNumber) - 1) * PRODUCTS_PER_PAGE;

  const res = await fetch(
    `https://naszsklep-api.vercel.app/api/products?take=${PRODUCTS_PER_PAGE}&offset=${offset}`
  );
  const data: StoreApiResponse[] = await res.json();

  return {
    props: { data, pageNumber },
  };
};

export const getStaticPaths = async () => {
  let paths = [];
  if (PRODUCT_PAGES <= MAX_PRODUCT_PAGES_TO_PRERENDER) {
    paths = Array.from({ length: PRODUCT_PAGES }).map((_, index) => ({
      params: { pageNumber: String(index + 1) },
    }));
  }

  paths = Array.from({ length: MAX_PRODUCT_PAGES_TO_PRERENDER }).map(
    (_, index) => ({ params: { pageNumber: String(index + 1) } })
  );

  // Prerender the last page, that is accessible from the pagination
  paths.push({ params: { pageNumber: String(PRODUCT_PAGES) } });

  return {
    paths,
    fallback: true,
  };
};

export type InferGetStaticPaths<T> = T extends () => Promise<{
  paths: Array<{ params: infer R }>;
}>
  ? { params?: R }
  : never;

export default ProductsPage;
