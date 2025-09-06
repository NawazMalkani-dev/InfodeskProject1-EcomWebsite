<?php
include 'db-config.php';

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $message = $conn->real_escape_string($_POST['message']);

    $sql = "INSERT INTO user_review (name, email, message) VALUES ('$name', '$email', '$message')";

    if ($conn->query($sql) === TRUE) {
        echo '
        <!Doctype html>
        <html>
        <head>
            <title>Thank You!</title>
            <style>
                .heading{
                    font-size: 3rem;
                    line-height: 1.5rem;
                }   
                p{
                    font-size: 1.2rem;
                }
            </style>
        </head>
        <body>
            <div class="title">
                <h2 class="heading">Thank You For Your Response!</h2>
                <hr>
                <p>We appritiate your help for providing us with a wonderful review, that means a lot and hope you had a great time here</p>
            </div>
        </body>
        </html>
        ';
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
