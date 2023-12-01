const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [{ 
      model: Category,
      attributes: ['id', 'category_name']
    }, 
    { 
      model: Tag,
      attributes: ['id', 'tag_name']
    }],
  })
  .then(productData => {
    res.json(productData);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  }
  );
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findByPk(req.params.id, {
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [{ 
      model: Category,
      attributes: ['id', 'category_name']
    },
    { 
      model: Tag,
      attributes: ['id', 'tag_name']
    }],
  })
  .then(productData => {
  if (!productData) {
    res.status(404).json({ message: "No product found with that id!" });
    return;
  }
  res.status(200).json(productData);
})
.catch (err => {
  console.log(err);
  res.status(500).json(err);
}
);
});

// create new product
router.post('/', (req, res) => {
  // create Product
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
  })
    .then((product) => {
      // if there are product tags, create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => ({
          product_id: product.id,
          tag_id,
        }));
        return ProductTag.bulkCreate(productTagIdArr).then(() => product);
      }
      // if no product tags, just respond
      return product;
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id }
        })
          .then((productTags) => {
            // create a filtered list of new tag_ids
            const productTagIds = productTags.map(({ tag_id }) => tag_id);
            const newProductTags = req.body.tagIds
              .filter((tag_id) => !productTagIds.includes(tag_id))
              .map((tag_id) => {
                return {
                  product_id: req.params.id,
                  tag_id,
                };
              });

            // figure out which ones to remove
            const productTagsToRemove = productTags
              .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
              .map(({ id }) => id);

            // run both actions
            return Promise.all([
              ProductTag.destroy({ where: { id: productTagsToRemove } }),
              ProductTag.bulkCreate(newProductTags),
            ]);
          })
          .then(() => res.json(product)); // Send the response here
      } else {
        // If no tags provided, just send the response with the updated product
        res.json(product);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then(productData => {
  if (!productData) {
    res.status(404).json({ message: "No product found with that id!" });
    return;
  }
  res.status(200).json(productData);
})
.catch (err => {
  res.status(500).json(err)
}
);
});

module.exports = router;
