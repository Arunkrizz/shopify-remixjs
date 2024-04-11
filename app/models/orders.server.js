import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);

  // Fetch orders from Shopify Admin API
  const ordersResponse = await fetchOrdersFromShopify(session.shop, admin.graphql);

  // Process orders data
  const orders = await ordersResponse.json();
  console.log(orders,"1qaz")

  return json({
    orders,
  });
}

export async function fetchOrdersFromShopify(shop, graphql) {
  // Make a request to Shopify Admin API to fetch orders
  const response = await graphql(
    `
      query {
        orders(first: 10) {
          edges {
            node {
              id
              name
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              createdAt
              customer {
                displayName
              }
            }
          }
        }
      }
    `
  );

  return response;
}
