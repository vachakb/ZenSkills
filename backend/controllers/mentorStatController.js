const prisma = require("../models/prismaClient");

//controller to fetch total mentees mentored by mentor
const totalMenteeMentored = async(req,res) => {
    const mentorId = req.user.id;
    try {
        const totalMentees = await prisma.SessionBooking.count({
            where: {
                session: {
                    mentor_id: mentorId
                },
            },
            distinct: ['user_id']
        })
    } catch (error) {
        console.error("Error fetching total mentees:", error);
    }
}


//controller to fetch total sessions conducted by mentor
const totalSessionsConducted = async(req,res) => {
    const mentorId= req.user.id;
    try {
        const totalSessions = await prisma.mentor.findMany({
            where:{
                id: mentorId
            },
            data:{
                number_of_sessions_conducted: true
            }
        })
        res.json({totalSessions});
    } catch (error) {
        console.error("Error fetching total sessions conducted:", error);
    }
}


module.exports = {
    totalMenteeMentored, 
    totalSessionsConducted,
};