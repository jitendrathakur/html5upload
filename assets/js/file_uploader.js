(function($) {
    
    $.fn.rt_uploader = function(options) {
        var settings = 
            $.extend({}, {
                iBytesUploaded : 0,
                iBytesTotal : 0,
                iPreviousBytesLoaded : 0,
                max_size_err : "File max size limit error",
                file_allow_err : "File type not supported",
                oTimer : 0,
                sResultFileSize : '',
                process_text : "Please wait... processing",
                preview_id : "img_prv",
                iMaxFilesize : 50000000,
                upload_sel_btn : "uploadFile",
                start_upload_btn : "startUpload",
                form_up_id : "uploadForm",
                upload_cont : ".uploader_cont"
                
            }, options);
           
           
           initialize_buttons();
           create_infos();
           $(settings.upload_cont).on("change","#"+settings.upload_sel_btn,function(){
                   fileSelected(this);
            });

           $(settings.upload_cont).on("click","#"+settings.start_upload_btn,function(){
               startUploading(settings.upload_sel_btn);
            });
           
            function initialize_buttons()
            {
                var html='<span class="btn btn-success fileinput-button"><i class="icon-plus icon-white"></i><span>Select</span><input type="file" class="input inp-medium" id="'+settings.upload_sel_btn+'" name="'+settings.upload_sel_btn+'[]" multiple="multiple" value="" /></span><span class="btn btn-primary fileinput-button"><i class="icon-upload icon-white"></i><span>Start Upload</span><input type="button" class="input inp-medium" id="'+settings.start_upload_btn+'" name="'+settings.start_upload_btn+'" value="" /></span>';
                $(".uploader_cont").html(html);
            };

           function create_infos()
            {
                var html = '<div id="'+settings.preview_id+'" class="span2"></div><div id="error"></div><div id="abort"></div><div id="warnsize"></div><div id="upload_response"></div><div id="filename"></div><div id="filesize"></div><div id="filetype"></div>';
                $(".info_div").html(html);
                html='<div id="progress_percent"></div><div id="progress" class="progressbar"></div><div id="speed"></div><div id="remaining"></div><div id="b_transfered"></div>';
                $(".progress_div").html(html);
            }

            function set_file_info(oFile,oImage)
            {

                $('.info_div').show();
                $('#filename').html('Name: ' + oFile.name);
                $('#filesize').html( 'Size: ' + settings.sResultFileSize);
                $('#filetype').html( 'Type: ' + oFile.type);
                
                // var rFilter = /^(video\/wmv|video\/flv|video\/mp4|video\/avi|video\/mov)$/i;
            }
           
           

        function fileSelected(thisObj) {

            // get selected file element
            var thisid=thisObj.id;

            var oFile = document.getElementById(thisid).files[0];

            var er_ret = filter_test(oFile);
            if(!er_ret)
                return false;

            var oImage = document.getElementById(settings.preview_id);

            // prepare HTML5 FileReader
            var oReader = new FileReader();
            oReader.onload = function(e){
                
                
                var imgTag = document.createElement('img');
                imgTag.setAttribute('src',e.target.result);
                imgTag.setAttribute('alt',"preview");
                $("#"+settings.preview_id).html('');
                oImage.appendChild(imgTag);

                // we are going to display some custom image information here
                settings.sResultFileSize = bytesToSize(oFile.size);
                set_file_info(oFile);
            };
            
            // read selected file as DataURL
            oReader.readAsDataURL(oFile);
            return true;
        }

        function startUploading(thisid) {

            var oFile = document.getElementById(thisid).files[0];
            if(oFile==null || oFile==undefined)
            {
                return false;
            }

            var er_ret = filter_test(oFile);
            if(!er_ret)
                return false;
            // cleanup all temp states
            settings.iPreviousBytesLoaded = 0;
            $('.info_div').hide();
            $('.progress_div').show();

            $('#progress_percent').html('');
            var oProgress = $('#progress');
            oProgress.show();
            oProgress.css("width", '0%');


            var upload_link = $("#"+settings.form_up_id).attr("action");
            // get form data for POSTing
            //var vFD = document.getElementById('upload_form').getFormData(); // for FF3
            var vFD = new FormData(document.getElementById(settings.form_up_id)); 
            // create XMLHttpRequest object, adding few event listeners, and POSTing our data
            var oXHR = new XMLHttpRequest();        
            oXHR.upload.addEventListener('progress', uploadProgress, false);
            oXHR.addEventListener('load', uploadFinish, false);
            oXHR.addEventListener('error', uploadError, false);
            oXHR.addEventListener('abort', uploadAbort, false);
            oXHR.open('POST', upload_link);
            oXHR.send(vFD);

            // set inner timer
            //oTimer = setInterval(doInnerUpdates, 300);
        }

        function doInnerUpdates() { // we will use this function to display upload speed
            var iCB = settings.iBytesUploaded;
            var iDiff = iCB - settings.iPreviousBytesLoaded;

            // if nothing new loaded - exit
            if (iDiff == 0)
                return;

            settings.iPreviousBytesLoaded = iCB;
            iDiff = iDiff * 2;
            var iBytesRem = settings.iBytesTotal - settings.iPreviousBytesLoaded;
            var secondsRemaining = iBytesRem / iDiff;

            // update speed info
            var iSpeed = iDiff.toString() + 'B/s';
            if (iDiff > 1024 * 1024) {
                iSpeed = (Math.round(iDiff * 100/(1024*1024))/100).toString() + 'MB/s';
            } else if (iDiff > 1024) {
                iSpeed =  (Math.round(iDiff * 100/1024)/100).toString() + 'KB/s';
            }

            $('#speed').html(iSpeed);
            $('#remaining').html('| ' + secondsToTime(secondsRemaining));        
        }

        function uploadProgress(e) { // upload process in progress
            if (e.lengthComputable) {
                settings.iBytesUploaded = e.loaded;
                settings.iBytesTotal = e.total;
                var iPercentComplete = Math.round(e.loaded * 100 / e.total);
                var iBytesTransfered = bytesToSize(settings.iBytesUploaded);
                doInnerUpdates();
                $('#progress_percent').html(iPercentComplete.toString() + '%');
                $('#progress').css("width" , (iPercentComplete).toString() + '%');
                $('#b_transfered').html(iBytesTransfered);
                if (iPercentComplete == 100) {
                    var oUploadResponse = $('#upload_response');
                    oUploadResponse.html('<h1>'+settings.process_text+'</h1>');
                    oUploadResponse.show();
                }
            } else {
                $('#progress').html(settings.compute_error);
            }
        }

        function uploadFinish(e) { // upload successfully finished
            var oUploadResponse = $('#upload_response');
            oUploadResponse.html();
            oUploadResponse.show();
            $('#progress_percent').html('100%');
            $('#progress').css("width", '100%');
            $('#filesize').html(settings.sResultFileSize);
            $('#remaining').html('| 00:00:00');
            setTimeout(function(){
                clear_all_display();
                clear_all_display_info();
            },2000);
            var data=$.parseJSON(e.target.responseText);
            clearInterval(settings.oTimer);
            process_returndata(data);
        }

        function uploadError(e) { // upload error
            $('#error').show();
            $('#error').html("upload error");
            clearInterval(settings.oTimer);
        }  

        function uploadAbort(e) { // upload abort
            $('#abort').show();
            $('#abort').html("Uploading cancelled");
            clearInterval(settings.oTimer);
        }

        function filter_test(oFile)
        {
            // filter for image files

            var rFilter = /^(image\/jpg|image\/jpeg|image\/png|image\/gif)$/i;;

            if($.isEmptyObject(oFile))
                return false;
            if (! rFilter.test(oFile.type)) {
                clear_all_display_info();
                $('#error').show();
                $('#error').html(settings.file_allow_err);
                return false;
            }

            // little test for filesize

            if (oFile.size > settings.iMaxFilesize) {
                clear_all_display_info();
                $('#warnsize').html(settings.max_size_err);
                $('#warnsize').show();
                return false;
            }
            return true;
        }

        /* we will use this function to convert seconds in normal time format */

        function secondsToTime(secs) { 


            var hr = Math.floor(secs / 3600);
            var min = Math.floor((secs - (hr * 3600))/60);
            var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

            if (hr < 10) {hr = "0" + hr; }
            if (min < 10) {min = "0" + min;}
            if (sec < 10) {sec = "0" + sec;}
            if (hr) {hr = "00";}
            return hr + ':' + min + ':' + sec;
        };

        function bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB'];
            if (bytes == 0) return 'n/a';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        };

        function clear_all_display()
        {
            $('.progress_div').hide();
            $('.progress_div div').hide().html('');
        }

        function clear_all_display_info()
        {
            
            $('.info_div').hide();
            $('.info_div div').html('').hide();
            
        }


    };
})(jQuery);
