import Listing from "../models/listing.model.js";
import { StatusCodes } from "http-status-codes";
import * as CustomError from '../errors/index.js';


// create lisiting controller 
export const createListing = async (req, res) => {
    // getting the following proberties from request body
    const { offer, regularPrice, discountPrice } = req.body;

    // logic to prevent user from inputing dicountPrice value bigger than regularPrice value if offer is true
    if (offer) {
        if (!discountPrice) {
            throw new CustomError.BadRequestError('please provide an offer price');
        }

        if (!regularPrice) {
            throw new CustomError.BadRequestError('please provide the regular price when offer is active');
        }

        if (Number(discountPrice) >= Number(regularPrice)) {
            throw new CustomError.BadRequestError('please provide an offer price that is lower than the regular price');
        }
    } else {
        // omitting null to discountPrice if offer is false
        req.body.discountPrice = null;
    }

    req.body.userRef = req.user.userId;
    const listing = await Listing.create(req.body)

    res.status(StatusCodes.CREATED).json({ listing });
}

// update listing controller 
export const updateListing = async (req, res) => {
    // getting the listing id from URL Parameter
    const { id: listingId } = req.params;
    // getting the following proberties from request body
    const { offer, regularPrice, discountPrice } = req.body;

    // logic to prevent user from inputing dicountPrice value bigger than regularPrice value if offer is true
    if (offer) {
        if (!discountPrice) {
            throw new CustomError.BadRequestError('please provide an offer price');
        }

        if (!regularPrice) {
            throw new CustomError.BadRequestError('please provide the regular price when offer is active');
        }

        if (Number(discountPrice) >= Number(regularPrice)) {
            throw new CustomError.BadRequestError('please provide an offer price that is lower than the regular price');
        }
    } else {
        // omitting null to discountPrice if offer is false
        req.body.discountPrice = null;
    }

    const listing = await Listing.findOneAndUpdate({ _id: listingId }, req.body, {
        new: true,
        runValidators: true
    });

    // checking if the listing exists
    if (!listing) {
        throw new CustomError.BadRequestError(`there is no listing with id: ${listingId}`);
    }

    res.status(StatusCodes.OK).json({ listing });
};

//delete Listing controller 
export const deleteListing = async (req, res) => {
    // getting the listing id from URL Parameter
    const { id: listingId } = req.params

    const listing = await Listing.findOneAndDelete({ _id: listingId })
    // checking if the listing exists
    if (!listing) {
        throw new CustomError.BadRequestError(`there is no listing with id: ${listingId}`);
    }

    res.status(StatusCodes.OK).json({ msg: `the listing has been deleted!` })
}

// get single listing controller 
export const getSingleListing = async (req, res) => {
    // getting the listing id from URL Parameter
    const { id: listingId } = req.params

    const listing = await Listing.findOne({ _id: listingId })

    // checking if the listing exists
    if (!listing) {
        throw new CustomError.BadRequestError(`there is no listing with id: ${listingId}`);
    }

    res.status(StatusCodes.OK).json({ listing })
}

// get all listing controller
export const getAllListings = async (req, res) => {
    // Parsing pagination parameters with default values (9 is default)
    const limit = parseInt(req.query.limit) || 9;
    // Skip this many items (used for pagination)
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Parsing and normalizing the 'offer' filter (true/false or both)
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
    }

    // Parsing and normalizing the 'furnished' filter
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
    }

    // Parsing and normalizing the 'parking' filter
    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
    }

    // Parsing and normalizing the 'type' filter (sale/rent)
    let type = req.query.type;
    if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
    }

    // Search term for filtering by listing name (case-insensitive)
    const searchTerm = req.query.searchTerm || '';

    // Sorting configuration (e.g., 'createdAt', 'price', etc.)
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    // Perform MongoDB query with filters
    const listings = await Listing.find({
        // Searching by name (partial + case-insensitive)
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
    })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);

    return res.status(StatusCodes.OK).json({ listings });
};
