<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khảo sát Sự kiện</title>
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(to right, #ff666e, #f847a2);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 90vh;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            padding: 30px;
            max-width: 600px;
            width: 100%;
            margin: auto;
        }
        h1 {
            color: #333;
            text-align: center;
            font-size: 24px;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            line-height: 1.6;
            text-align: center;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            text-align: center;
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #333;
            font-size: 16px;
        }
        .star-rating {
            display: flex;
            gap: 5px;
            justify-content: center;
        }
        .star {
            font-size: 30px;
            color: #ccc;
            cursor: pointer;
            transition: color 0.3s ease, transform 0.3s ease;
        }
        .star:hover,
        .star.hovered {
            color: #ffcc00;
            transform: scale(1.1);
        }
        .star.selected {
            color: #ffcc00;
        }
        textarea {
            max-width: 100%;
            min-width: 100%;
            min-height: 100px;
        }
        textarea, input[type="email"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            outline: none;
            transition: border 0.3s ease;
        }
        textarea:focus, input[type="email"]:focus {
            border-color: #2575fc;
            box-shadow: 0 0 5px rgba(37, 117, 252, 0.3);
        }
        input[type="submit"] {
            background-color: #d1647f;
            color: #fff;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
            width: 100%;
        }
        input[type="submit"]:hover {
            background-color: #ca1e71d6;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Khảo sát Sự kiện {{ $event->name }}</h1>
    <p>Xin vui lòng dành chút thời gian để đánh giá sự kiện của chúng tôi.</p>
    
    <form action="{{ route('feedback.store') }}" method="POST">
        @csrf

        <input type="hidden" name="event_id" value="{{ $event->id }}">
        <input type="hidden" name="user_id" value="{{ $user->id }}">

        <div class="form-group">
            <label>Đánh giá chất lượng nội dung của sự kiện:</label>
            <div class="star-rating">
                <span class="star" data-value="1">&#9733;</span>
                <span class="star" data-value="2">&#9733;</span>
                <span class="star" data-value="3">&#9733;</span>
                <span class="star" data-value="4">&#9733;</span>
                <span class="star" data-value="5">&#9733;</span>
            </div>
            <input type="hidden" id="contentQuality" name="rating">
            <textarea name="feedback" rows="2" placeholder="Nhập đánh giá của bạn..."></textarea>
        </div>

        <div class="form-group">
            <label>Đề xuất cải thiện:</label>
            <textarea name="suggestions" rows="2" placeholder="Nhập ý kiến của bạn..."></textarea>
        </div>

        <input id="submit" type="submit" value="Gửi phản hồi">
    </form>
</div>

<script>
    const stars = document.querySelectorAll('.star');
    const hiddenInput = document.getElementById('contentQuality');
    const submit = document.getElementById('submit');

    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            resetStars();
            highlightStars(index + 1);
        });

        star.addEventListener('mouseout', () => {
            resetStars();
            highlightStars(hiddenInput.value);
        });

        star.addEventListener('click', () => {
            hiddenInput.value = index + 1;
            resetStars();
            highlightStars(hiddenInput.value);
        });
    });

    function highlightStars(count) {
        for (let i = 0; i < count; i++) {
            stars[i].classList.add('selected');
        }
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('selected');
        });
    }

    submit.addEventListener('click', () => {
        if (hiddenInput.value === '') {
            alert('Vui lòng chọn số sao đánh giá!');
        }
    });
</script>

</body>
</html>
