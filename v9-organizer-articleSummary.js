  /***
*     @author Victor Chimenti, MSCS
*     @file v9-organizer-articleSummary.js
*           v9/organizer/articleSummary
*
*     This new content type is a generic knowledge base article that can be used
*     in a variety of environments that require tagged/filterable content.
*
*     This content type will work in conjunction with the Organizer Zone-A
*     and each item will contain one searchable, article.
*
*     Document will write once when the page loads
*
*     @version 5.1.7
*/







    /***
     *      Import T4 Utilities
     */
     importClass(com.terminalfour.media.IMediaManager);
     importClass(com.terminalfour.spring.ApplicationContextProvider);
     importClass(com.terminalfour.publish.utils.BrokerUtils);
     importClass(com.terminalfour.media.utils.ImageInfo);
 
 
 
 
     /***
      *      Extract values from T4 element tags
      *      and confirm valid existing content item field
      */
     function getContentValues(tag) {
         try {
             let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag).trim();
             return {
                 isError: false,
                 content: _tag == '' ? null : _tag
             };
         } catch (error) {
             return {
                 isError: true,
                 message: error.message
             };
         }
     }
 
 
 
 
     /***
      *      Returns an array of sdg items
      */
     function assignSdgList(arrayOfValues) {
 
         let listValues = '';
 
         for (let i = 0; i < arrayOfValues.length; i++) {
 
             listValues += '<li class="list-group-item sdgIcon">' + arrayOfValues[i].trim() + '</li>';
         }
 
         return listValues;
     }
 



    /***
      *      Returns an array of sdg items
      */
     function assignLsapList(arrayOfValues) {

        let listValues = '';

        for (let i = 0; i < arrayOfValues.length; i++) {

            listValues += '<li class="list-group-item lsapIcon">' + arrayOfValues[i].trim() + '</li>';
        }

        return listValues;
     }
 
 
 

     /***
      *      Returns a media object
      */
     function getMediaInfo(mediaID) {
 
         let mediaManager = ApplicationContextProvider.getBean(IMediaManager);
         let media = mediaManager.get(mediaID, language);
 
         return media;
     }
 
 
 
 
     /***
      *      Returns a media stream object
      */
     function readMedia(mediaID) {
 
         let mediaObj = getMediaInfo(mediaID);
         let oMediaStream = mediaObj.getMedia();
 
         return oMediaStream;
     }
 
 
 
 
     /***
      *      Returns a formatted html img tag
      */
     function mediaTag(itemId) {
 
        // media path would be a good place to route through get content values to check for nulls and return a detailed error code
         let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + itemId + '" />');
         let mediaInfo = getMediaInfo(itemId);
         let media = readMedia(itemId);
         let info = new ImageInfo();
         info.setInput(media);
 
         let mediaHTML = (info.check()) ?
             '<figure class="figure"><img src="' + mediaPath + '" class="listgroupImage figure-img img-fluid" title="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure><figcaption class="figure-caption visually-hidden hidden">' + mediaInfo.getName() + '</figcaption>' :
             '<span class="listgroupImage visually-hidden hidden">Invalid Image ID</span>';
 
         return mediaHTML;
     }
 
 
 
 
     /***
      *      Returns a formatted html img tag
      */
     function getTarget(itemId) {
 
         let mediaInfo = getMediaInfo(itemId);
         let media = readMedia(itemId);
         let info = new ImageInfo();
         info.setInput(media);
 
         let target = (info.check()) ? '' + mediaInfo.getName() + '' : null;
 
         return target;
     }
 
 
 
 
     /***
      *      Returns an array of list items
      */
     function formatTargets(arrayOfValues) {
 
         let listValues = '';
 
         for (let i = 0; i < arrayOfValues.length; i++) {
 
             if (arrayOfValues[i]) {
                 let cleanValue = arrayOfValues[i].replace(/\s/g, '-');
                 listValues += '' + cleanValue.trim() + ' ';
             }
         }
 
         return listValues;
     }

 
 
 
     /***
      *      Write the document
      */
     function writeDocument(array) {
 
         for (let i = 0; i < array.length; i++) {
 
             document.write(array[i]);
         }
     }




try {



         /***
          *      Dictionary of content
          * */
          let cejscDict = {
 
            contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
            articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
            articleImage: getContentValues('<t4 type="content" name="Image" output="normal" formatter="path/*" />'),
            college: getContentValues('<t4 type="content" name="College" output="normal" modifiers="striptags,htmlentities" />'),
            academicLevel: getContentValues('<t4 type="content" name="Section Academic Level" output="normal" modifiers="striptags,htmlentities" />'),
            primarySectionName: getContentValues('<t4 type="content" name="Primary Section Name" output="normal" modifiers="striptags,htmlentities" />'),
            subjectDescription: getContentValues('<t4 type="content" name="Subject" output="normal" modifiers="striptags,htmlentities" />'),
            icons: getContentValues('<t4 type="content" name="Icon ID" output="normal" modifiers="striptags,htmlentities" />'),
            lsapIcons: getContentValues('<t4 type="content" name="LSAP ID" output="normal" modifiers="striptags,htmlentities" />'),             
            summaryDescription: getContentValues('<t4 type="content" name="Plaintext Description" output="normal" modifiers="striptags,htmlentities" />'),
            fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
            contentId: getContentValues('<t4 type="meta" meta="content_id" />')

        };


            /* -- Assign all the things -- */
    var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />"); 
    var articleImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Image' output='normal' formatter='path/*' />");
    var altarticleImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Alt Image' output='normal' modifiers='striptags,htmlentities' />");
    var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Description' output='normal' modifiers='striptags,htmlentities'  />");
    var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Full Article' output='normal' display_field='value' />");
    var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' use-element='true' filename-element='External Link' modifiers='striptags,htmlentities' />");
    var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    var contentID = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='content_id' />");
    var lastModified = '<div class="lastModified" style="display:inline-block"><p>Last modified: <t4 type="meta" meta="last_modified" format="MMMM d, yyyy" /></p></div>'; 
    var titleLink = "";
    var thumbNailString = "";


                 /***
          *  Parse and format sdg icons
          * 
          * */
                  if (cejscDict.icons.content) {
 
                    let iconArray = cejscDict.icons.content.split(',');
                    let iconPathArray = [];
       
                    iconArray.sort();
        
                    for (let icon in iconArray) {
        
                        iconPathArray[icon] = mediaTag(iconArray[icon].trim());
                    }
        
                    let iconValues = assignSdgList(iconPathArray);
                    listOfIcons = '<ul class="iconDashboard list-group list-group-horizontal">' + iconValues + '</ul>';
                }
       
       
       
       
               /***
                 *  Parse and format lsap icons
                 * 
                 * */
               if (cejscDict.lsapIcons.content) {
       
                   let iconArray = cejscDict.lsapIcons.content.split(',');
                   let iconPathArray = [];
       
                   iconArray.sort();
       
                   for (let icon in iconArray) {
       
                       iconPathArray[icon] = mediaTag(iconArray[icon].trim());
                   }
       
                   let iconValues = assignLsapList(iconPathArray);
                   listOfLsapIcons = '<ul class="lsapIconDashboard list-group list-group-horizontal">' + iconValues + '</ul>';
               }
       
       
        
          
                /***
                 *  write document once
                 * 
                 * */
                writeDocument(
                    [
                        beginningHTML,
                        openCardHeader,
                        titleLink,
                        subtitleString,
                        closeCardHeader,
                        openBodyWrapper,
                        summaryString,
                        listOfLsapIcons,
                        listOfIcons,
                        sectionIdString,
                        closeBodyWrapper,
                        endingHTML
                    ]
                );

                



  
  
    /* -- Prepare all the things -- */
    var beginningHTML = '<article class="knowledgeArticle card border-start border-top-0 border-bottom-0 border-end-0" aria-label="' + articleTitle + '" id="id' + contentID + '"><div class="knowledgeItem standardContent">';
    var endingHTML = '</div></article>';
  
  
  
    /* determine which link, if any, goes in the title */
    if (articleFullBody == "") {
        titleLink = "<h3>" + articleTitle + "</h3>";
    } else {
        titleLink = '<h3><a href="' + fullTextLink + '">' + articleTitle + '</a></h3>';
    }
  
  
    /* determine which link, if any, goes on the image */
    if (externalLink == "") {
        thumbNailString = '<div class="knowledgeImage"><img src="' + articleImage + '" class="articleImage" alt="' + altarticleImage + '" /></div>';
    } else {
        thumbNailString = '<div class="knowledgeImage"><a href="' + externalLink + '" target="_blank"><img src="' + articleImage + '" class="articleImage" alt="' + altarticleImage + '" /></a></div>';
    }
    
  
  
    /* -- Write all the things -- */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="articleSummary">');
    document.write('<div class="summary"><p>' + articleSummary + '</p></div>')
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, lastModified));
    document.write('</div>'); // close articleSummary
    document.write(endingHTML);
  
  
    
  
  } catch (err) {
    document.write(err.message);
  }
  