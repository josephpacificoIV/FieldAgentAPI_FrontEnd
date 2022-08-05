package learn.field_agent.controllers;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice // 1
public class GlobalExceptionHandler {


    @ExceptionHandler(DataAccessException.class) // 2
    public ResponseEntity<ErrorResponse> handleException(DataAccessException ex) { // 3
        return new ResponseEntity<ErrorResponse>(
                new ErrorResponse("We can't show you the details, but something went wrong in our database. Sorry :("),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }


    // IllegalArgumentException is the super class for many Java exceptions
    // including all formatting (number, date) exceptions.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleException(IllegalArgumentException ex) {

        // Log the exception?

        return new ResponseEntity<ErrorResponse>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // This is our absolute last resort. Yuck.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {

        // Log the exception?

        return new ResponseEntity<ErrorResponse>(
                new ErrorResponse("Something went wrong on our end. Your request failed. :("),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleException(HttpMessageNotReadableException ex) {

        // Log the exception?

        return new ResponseEntity<ErrorResponse>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleException(HttpMediaTypeNotSupportedException ex) {

        // Log the exception?

        return new ResponseEntity<ErrorResponse>(
                new ErrorResponse(ex.getMessage()),
                HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }


    /*package learn.field_agent.controllers;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
    @ControllerAdvice
    public class GlobalExceptionHandler {
        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<String> handleException(DataIntegrityViolationException ex) {
            return new ResponseEntity<>("Data integrity cannot be violated", HttpStatus.FORBIDDEN);
        }
        @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
        public ResponseEntity<String> handleException(HttpMediaTypeNotSupportedException ex) {
            return new ResponseEntity<>("Input data invalid", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }
        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<String> handleException(HttpRequestMethodNotSupportedException ex) {
            return new ResponseEntity<>("Method not allowed on the specified URL", HttpStatus.BAD_REQUEST);
        }
        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<String> handleException(HttpMessageNotReadableException ex) {
            return new ResponseEntity<>("Invalid JSON", HttpStatus.BAD_REQUEST);
        }
        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<String> handleException(MethodArgumentTypeMismatchException ex) {
            return new ResponseEntity<>("Invalid URL", HttpStatus.BAD_REQUEST);
        }
        @ExceptionHandler(Exception.class)
        public ResponseEntity<String> handleException(Exception ex) {
            return new ResponseEntity<>("Whoops! Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }*/




}
