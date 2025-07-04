import axios from "axios";


// ============================================================
// Get Address Details by lat and long
// ============================================================

export const getAddressDetails = async (req, res) => {
    try {
        const { lat, long } = req.query;

        if (!lat || !long) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            });
        }

        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`);

        res.status(200).json({
            success: true,
            address: response.data.address,
            message: "Address details fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching address details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch address details",
            error: error.message,
        });
    }
}