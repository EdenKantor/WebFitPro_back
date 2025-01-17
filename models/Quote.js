import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    quote: {
        type: String
    },

});

export default mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
