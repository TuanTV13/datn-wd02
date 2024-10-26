<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cảm Ơn Khách Hàng</title>
</head>
    <body style="font-family: 'Poppins', Arial, sans-serif">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 20px;">
                    <table class="content" width="900" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                        <!-- Header -->
                        <tr>
                            <td class="header" style="padding: 20px; text-align: center; color: #333; font-size: 24px;">
                                Cảm ơn bạn đã tham dự sự kiện "{{ $event->name }}"!
                            </td>
                        </tr>
    
                        <!-- Body -->
                        <tr>
                            <td class="body" style="padding: 20px; text-align: center; font-size: 16px; line-height: 1.6;">
                                Chúng tôi xin chân thành cảm ơn bạn đã tham gia sự kiện!
                            <br><br>
                                Chúng tôi hy vọng bạn đã có những trải nghiệm tuyệt vời và những kỷ niệm đáng nhớ. Để giúp chúng tôi cải thiện hơn nữa, xin vui lòng cho chúng tôi biết ý kiến của bạn.            
                            </td>
                        </tr>
    
                        <!-- Call to action Button -->
                        <tr>
                            <td style="padding: 0px 20px 0px 20px; text-align: center;">
                                <!-- CTA Button -->
                                <table cellspacing="0" cellpadding="0" style="margin: auto;">
                                    <tr>
                                        <td align="center" style="background: linear-gradient( to right, #c32f74d6, #eb378b96);; padding: 10px 20px; border-radius: 5px;">
                                            <a href="{{ $feedbackUrl }}" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">Điền đánh giá</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td class="body" style="padding: 20px; text-align: center; font-size: 16px; line-height: 1.6;">
                                Xin chân thành cảm ơn!             
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td class="footer" style="padding: 20px; text-align: center; color: #888; font-size: 14px;">
                                Copyright &copy; Eventify 2024. All rights reserved.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
