<?php require_once('config.php'); ?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Cache-control" content="no-cache" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Image upload</title>
    
        <link href="<?php echo $host ;?>assets/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo $host ;?>assets/css/styles.css" rel="stylesheet" type="text/css" />
        <script>
            var $host ="<?php echo $host;?>"; 
        </script>
        <script src="<?php echo $host ;?>assets/js/jquery.js" type="text/javascript"></script>   
        <script>            
            
            $(document).ready(function(){
                $('.span12').rt_uploader({
                        max_size_err : "File max size limit error",
                        file_allow_err : "File type not supported",
                        process_text : "Please wait... processing",
                        preview_id : "img_prv",
                        iMaxFilesize : 50000000,
                        upload_sel_btn : "uploadFile",
                        start_upload_btn : "startUpload",
                        form_up_id : "uploadForm",
                        upload_cont : ".uploader_cont"
                });                
            });

            function process_returndata(data)
            {
                for(var i in data.img)
                {                    
                    var img = data.img[i];
                    $(".img_uploaded").append('<img src ="'+img+'" width="100" /><br/>');                    
                }
               
            }
        </script>
        <script src="<?php echo $host ;?>assets/js/file_uploader.js"></script>
    </head>
    <body>
        <div class="container content container-fluid">
            <div class="row-fluid">
                <h2 class="page-title">
                    Image Uploader
                </h2>
                <div class="span12">
                    <form action="upload.php" id="uploadForm" name="uploadForm">
                        <div class="uploader_cont"></div>
                    </form>
                </div>
                <div class="span12">
                    <div class="info_div"></div>
                    <div class="progress_div" style="display: none;"></div>
                </div>
                <div class="span12">
                    <div class="img_uploaded"></div>
                </div>
                
            </div>
        </div>
    </body>
</html>
