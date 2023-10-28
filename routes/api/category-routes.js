const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
//I looked over some past activities, I'm not sure if there's another way than to do it asynchroneously
router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
try {
  const categoryData = await Category.findAll({
    include: [{ model: Product }],
  });
  res.status(200).json(categoryData);
}
catch (err) {
  res.status(500).json(err);
}
});


router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }
    res.status(200).json(categoryData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(categoryData);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  then((updatedCategory) => {
    res.json(updatedCategory);
  }) .catch((err) => {
    console.log(err);
    res.json(err);
  });

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(deletedCategory);
  } catch(err)  {
    console.log(err);
    res.json(err);
  }
  });

module.exports = router;
