import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            // Validate discountPrice only if offer is true
            validate: {
                validator: function (value) {
                    // If offer is true, salePrice must be provided and be less than the regularPrice price
                    if (this.offer && (!value || value >= this.regularPrice)) {
                        return false;
                    }
                    return true;
                },
                message: 'offer price must be less than the reguler price if product is on sale',
            },
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        furnished: {
            type: Boolean,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["rent", "sale"],
            default: "sale"
        },
        offer: {
            type: Boolean,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;