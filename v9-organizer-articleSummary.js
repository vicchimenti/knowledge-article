  /***
*     @author Victor Chimenti, MSCS
*     @file v9-organizer-articleDescription.js
*           v9/organizer/articleDescription
*
*     This new content type is a generic knowledge base article that can be used
*     in a variety of environments that require tagged/filterable content.
*
*     This content type will work in conjunction with the Organizer Zone-A
*     and each item will contain one searchable, article.
*
*     Document will write once when the page loads
*
*     @version 6.1.1
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
          let knowledgeDict = {
 
            contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
            articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
            articleSubtitle: getContentValues('<t4 type="content" name="Subtitle" output="normal" modifiers="striptags,htmlentities" />'),
            articleImage: getContentValues('<t4 type="content" name="Image" output="normal" formatter="path/*" />'),
            articleDescription: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="striptags,htmlentities" />'),
            articleFullBody: getContentValues('<t4 type="content" name="Full Article" output="normal" modifiers="medialibrary,nav_sections" />'),
            topics: getContentValues('<t4 type="content" name="Topics" output="normal" modifiers="striptags,htmlentities" />'),
            linkSource: getContentValues('<t4 type="content" name="Link" output="normal" modifiers="nav_sections" />'),
            linkText: getContentValues('<t4 type="content" name="Link" output="linktext" modifiers="nav_sections" />'),
            mediaFile: getContentValues('<t4 type="content" name="PDF" output="file" />'),
            fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
            lastModified: getContentValues('<t4 type="meta" meta="last_modified" format="EEEE, MMMM d, yyyy" />'),
            contentId: getContentValues('<t4 type="meta" meta="content_id" />')

          };


            /* -- Assign all the things -- */
    // var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />"); 
    // var articleImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Image' output='normal' formatter='path/*' />");
    // var altarticleImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Alt Image' output='normal' modifiers='striptags,htmlentities' />");
    // var articleDescription = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Description' output='normal' modifiers='striptags,htmlentities'  />");
    // var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Full Article' output='normal' display_field='value' />");
    // var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' use-element='true' filename-element='External Link' modifiers='striptags,htmlentities' />");
    // var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    // var contentID = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='content_id' />");
    // var lastModified = '<div class="lastModified" style="display:inline-block"><p>Last modified: <t4 type="meta" meta="last_modified" format="MMMM d, yyyy" /></p></div>'; 
    var titleLink = "";
    var thumbNailString = "";


    /***
     *  Parse for image
     *  and process valid media id
     * 
     * */
    //  let imageIdTest = (knowledgeDict.articleImage.content) ?
    //       '<span>Image ID: ' + knowledgeDict.articleImage.content.getID() + '</span>' :
    //       '<span>Image ID: Attempt Failed</span>';



    //      let imageString = (expertsDict.primaryImage.content) ?
    //      '<span class="cardImageWrapper"><img src="' + expertsDict.primaryImage.content + '" class="expertsImage card-img-top p-0 m-0" alt="' + expertsDict.contentName.content + '" loading="auto" /></span>' :
    //      '<span class="expertsImage hidden visually-hidden">No Image Provided</span>';
 
    //  if (expertsDict.primaryImage.content) {
 
    //      let imageID = content.get('Photo').getID();
    //      let mediaInfo = getMediaInfo(imageID);
    //      let media = readMedia(imageID);
    //      let info = new ImageInfo();
    //      info.setInput(media);
 
    //      imageString = (info.check()) ?
    //          '<span class="cardImageWrapper"><img src="' + expertsDict.primaryImage.content + '" class="expertsImage card-img-top p-0 m-0" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></span>' :
    //          '<span class="cardImageWrapper"><img src="' + expertsDict.primaryImage.content + '" class="expertsImage noMediaId card-img-top p-0 m-0" loading="auto" /></span>';
    //  }


                 /***
          *  Parse and format sdg icons
          * 
          * */
                //   if (cejscDict.icons.content) {
 
                //     let iconArray = cejscDict.icons.content.split(',');
                //     let iconPathArray = [];
       
                //     iconArray.sort();
        
                //     for (let icon in iconArray) {
        
                //         iconPathArray[icon] = mediaTag(iconArray[icon].trim());
                //     }
        
                //     let iconValues = assignSdgList(iconPathArray);
                //     listOfIcons = '<ul class="iconDashboard list-group list-group-horizontal">' + iconValues + '</ul>';
                // }
       
       
       
       
               /***
                 *  Parse and format lsap icons
                 * 
                 * */
            //    if (cejscDict.lsapIcons.content) {
       
            //        let iconArray = cejscDict.lsapIcons.content.split(',');
            //        let iconPathArray = [];
       
            //        iconArray.sort();
       
            //        for (let icon in iconArray) {
       
            //            iconPathArray[icon] = mediaTag(iconArray[icon].trim());
            //        }
       
            //        let iconValues = assignLsapList(iconPathArray);
            //        listOfLsapIcons = '<ul class="lsapIconDashboard list-group list-group-horizontal">' + iconValues + '</ul>';
            //    }
       
       
        
          
                /***
                 *  write document once
                 * 
                 * */
                // writeDocument(
                //     [
                //         beginningHTML,
                //         openCardHeader,
                //         titleLink,
                //         subtitleString,
                //         closeCardHeader,
                //         openBodyWrapper,
                //         summaryString,
                //         listOfLsapIcons,
                //         listOfIcons,
                //         sectionIdString,
                //         closeBodyWrapper,
                //         endingHTML
                //     ]
                // );

                



  
  
    /***
     *  Set defaults
     * 
     * */
    let endingHTML = '</div></article>';
    let openRow = '<div class="row g-0 px-0">';
    let closeRow = '</div>';
    let openHeader = '<div class="card-header border-0 bg-transparent">';
    let closeHeader = '</div>';
    let openBody = '<div class="card-body">';
    let closeBody = '</div>';
    let openFooter = '<div class="card-footer border-0 bg-transparent">';
    let closeFooter = '</div>';



    /***
     *  Set wrapper
     * 
     * */
    let beginningHTML = (knowledgeDict.articleTitle.content) ?
        '<article class="knowledgeArticle card border-start border-top-0 border-bottom-0 border-end-0" aria-label="' + knowledgeDict.articleTitle.content + '" id="ka' + knowledgeDict.contentId.content + '"><div class="knowledgeItem standardContent">' :
        '<article class="knowledgeArticle card border-start border-top-0 border-bottom-0 border-end-0" aria-label="' + knowledgeDict.contentName.content + '" id="ka' + knowledgeDict.contentId.content + '"><div class="knowledgeItem standardContent">' ;





  
  
  
    /* determine which link, if any, goes in the title */
    if (!knowledgeDict.articleFullBody.content) {
        titleLink = "<h3>" + knowledgeDict.articleTitle.content + "</h3>";
    } else {
        titleLink = '<h3><a href="' + knowledgeDict.fullTextLink.content + '">' + knowledgeDict.articleTitle.content + '</a></h3>';
    }
  
  
    /* determine which link, if any, goes on the image */
    if (knowledgeDict.linkSource.content && knowledgeDict.articleImage.content) {

        thumbNailString = '<div class="knowledgeImage"><a href="' + knowledgeDict.linkSource.content + '" target="_blank"><img src="' + knowledgeDict.articleImage.content + '" class="articleImage" alt="" /></a></div>';

    } else {

        thumbNailString = '<div class="knowledgeImage"><img src="' + knowledgeDict.articleImage.content + '" class="articleImage" alt="" /></div>';

    }
    
  
  
    /* -- Write all the things -- */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(openHeader);
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write(closeHeader);
    document.write(openBody);
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="articleDescription">');
    document.write('<div class="summary"><p>' + knowledgeDict.articleDescription.content + '</p></div>');
    document.write(closeBody);
    document.write(openFooter);
    document.write(closeFooter);
    // document.write(imageIdTest);

    
    // document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, lastModified));
    document.write('</div>'); // close articleDescription
    document.write(endingHTML);
  
  
    
  
  } catch (err) {
    document.write(err.message);
  }
  