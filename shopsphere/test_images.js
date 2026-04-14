import { resolveProductImage } from './server/services/imageService.js';

async function test() {
  const products = [
    { prod_id: 1, prod_name: 'Nike Air Max', cat_name: 'Shoes' },
    { prod_id: 2, prod_name: 'Cotton T-shirt', cat_name: 'Apparel' },
    { prod_id: 3, prod_name: 'Sony Bravia TV', cat_name: 'Electronics' }
  ];

  for (const p of products) {
    const url = await resolveProductImage(p);
    console.log(`Product: ${p.prod_name} -> URL: ${url}`);
  }
}

test();
