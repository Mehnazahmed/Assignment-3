import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { User } from "../user/user.model";
import mongoose from "mongoose";

// const createBooking = catchAsync(
//   async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
//     try {
//       const userData = req.user;
//       const email = userData.userEmail;
//       // console.log(user);

//       const userInfo = await User.isUserExistsByEmail(email);
//       // console.log(userInfo);
//       const userId = userInfo._id;
//       // console.log("u", userId);

//       if (!userData) {
//         throw new AppError(
//           httpStatus.UNAUTHORIZED,
//           "User authentication failed"
//         );
//       }

//       const { facility, user, date, startTime, endTime } = req.body;

//       const bookingData: TBooking = {
//         facility,
//         date: new Date(date),
//         startTime,
//         endTime,
//         user: new mongoose.Types.ObjectId(userId),
//         // user: new mongoose.Types.ObjectId(userId),

//         payableAmount: 0,
//         isBooked: "confirmed",
//       };

//       const newBooking = await bookingServices.createBookingIntoDB(bookingData);

//       // Send a successful response
//       sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,

//         message: "Booking created successfully",
//         data: {
//           _id: newBooking._id,
//           facility: newBooking.facility.toString(),
//           date: newBooking.date.toISOString().split("T")[0],
//           startTime: newBooking.startTime,
//           endTime: newBooking.endTime,
//           user: newBooking.user.toString(),
//           payableAmount: newBooking.payableAmount,
//           isBooked: newBooking.isBooked,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

const createBooking = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const userData = req.user;
      const email = userData.userEmail;

      const userInfo = await User.isUserExistsByEmail(email);
      const userId = userInfo._id;

      if (!userData) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "User authentication failed"
        );
      }

      const { facility, date, startTime, endTime } = req.body;

      const bookingData: TBooking = {
        facility,
        date: new Date(date),
        startTime,
        endTime,
        user: new mongoose.Types.ObjectId(userId),
        payableAmount: 0,
        isBooked: "confirmed",
      };

      const newBooking = await bookingServices.createBookingIntoDB(bookingData);

      // Send a successful response
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking created successfully",
        data: {
          _id: newBooking._id,
          facility: newBooking.facility.toString(),
          date: newBooking.date.toISOString().split("T")[0],
          startTime: newBooking.startTime,
          endTime: newBooking.endTime,
          user: newBooking.user.toString(),
          payableAmount: newBooking.payableAmount,
          isBooked: newBooking.isBooked,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//get all bookings

const getAllBookings = catchAsync(async (req, res) => {
  try {
    const result = await bookingServices.getAllBookingsFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "api is not valid");
  }
});

const getUserBookings = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { userEmail } = req.user;

    // console.log(req.user);
    // console.log("last", userEmail);

    const bookings = await bookingServices.getBookingsByUser(userEmail);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  }
);

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingServices.deleteBookingFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking cancelled successfully",
    data: result,
  });
});

// const checkAvailability = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { date } = req.query;
//     const availableSlots = await bookingServices.checkAvailabilityFromDB(
//       date as string
//     );

//     // Send the response
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Availability checked successfully",
//       data: availableSlots,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const checkAvailability = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { date } = req.query;
//     const availableSlots = await bookingServices.checkAvailabilityFromDB(
//       date as string
//     );

//     console.log("Available Slots:", availableSlots); // Debugging line

//     // Send the response
//     res.json({
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Availability checked successfully",
//       data: availableSlots,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const bookingControllers = {
  createBooking,
  getAllBookings,
  deleteBooking,
  // checkAvailability,

  getUserBookings,
};
