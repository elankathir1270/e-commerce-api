const Product = require("../models/product.model");
const Review = require("../models/review.model");


//Review Comments Pool
const comments = [
  "Excellent product",
  "Highly recommended",
  "Value for money",
  "Very satisfied",
  "Build quality is great",
  "Battery life is excellent",
  "Average experience",
  "Could be better",
  "Amazing performance",
  "Fast delivery"
];

//Reviewers Pool
const reviewers = [
  "John",
  "Mike",
  "Sarah",
  "David",
  "Emma",
  "Sophia",
  "Chris",
  "Daniel",
  "James",
  "Robert"
];

const generateReviews =
  async () => {

    const products =
      await Product.find();

    const reviews = [];

    for (
      let i = 0;
      i < 100;
      i++
    ) {
      const product =
        products[
          Math.floor(
            Math.random() *
            products.length
          )
        ];

      reviews.push({
        productId:
          product._id,

        reviewerName:
          reviewers[
            Math.floor(
              Math.random() *
              reviewers.length
            )
          ],

        rating:
          Math.floor(
            Math.random() * 5
          ) + 1,

        comment:
          comments[
            Math.floor(
              Math.random() *
              comments.length
            )
          ],

        status:
          Math.random() > 0.1
            ? "APPROVED"
            : "PENDING",

        isDeleted: false
      });
    }

    return reviews;
  };

module.exports =
  generateReviews;