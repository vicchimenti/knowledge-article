  /***
*     @author Victor Chimenti, MSCS
*     @file v9-fulltext.js
*           Knowledge Base
*           ID: 5555
*           v9/fulltext
*
*     This new content type is a generic knowledge base article that can be used
*     in a variety of environments that require tagged/filterable content.
*
*     This content type will work in conjunction with the Organizer Zone-A
*     and each item will contain one searchable, article.
*
*     Document will write once when the page loads
*
*     @version 7.0
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
                 content: _tag !== '' ? _tag : null 
             };

         } catch (error) {

             return {
                 isError: true,
                 message: error.message
             };
         }
     }
 
 
 
 
     /***
      *        Returns a formatted unordered list
      */
     function assignList(tags) {

        let arrayofTags = tags.split(',');
        let listValues = '';

        for (let tag = 0; tag < arrayofTags.length; tag++) {
            
            listValues += '<li class="tag">' + arrayofTags[tag].trim() + '</li>';
        }

        return '<div class="knowledgeBaseItem tags"><ul class="categories">' + listValues + '</ul></div>';
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
      *      Returns a formatted html a href file download tag
      */
     function mediaTag(itemId) {
 
        let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + itemId + '" />');
        let mediaInfo = getMediaInfo(itemId);

        let mediaHTML = (mediaInfo) ?
            '<h4 class="card-text"><a class="mediaDownload card-link" href="' + mediaPath + '" title="Read the full document: ' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" download>' + mediaInfo.getName() + '</a></h4>' :
            '<span class="mediaDownload d-none visually-hidden hidden">Invalid Media ID</span>';

        return mediaHTML;
     }




    /***
      *      Returns a formatted html img tag
      */
     function imageTag(itemId) {

        let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + itemId + '" />');
        let mediaInfo = getMediaInfo(itemId);
        let media = readMedia(itemId);
        let info = new ImageInfo();
        info.setInput(media);

        let mediaHTML = (info.check()) ?
            '<figure class="figure"><img src="' + mediaPath + '" class="articleImage figure-img img-fluid" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure>' :
            '<figure class="d-none hidden visually-hidden"><span class="class="articleImage visually-hidden hidden">Invalid Image ID</span></figure>';

        return mediaHTML;
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
        linkSource: getContentValues('<t4 type="content" name="Link" output="linkurl" modifiers="nav_sections" />'),
        linkText: getContentValues('<t4 type="content" name="Link" output="linktext" modifiers="nav_sections" />'),
        mediaFile: getContentValues('<t4 type="content" name="Media File" output="normal" formatter="path/*" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        lastModified: getContentValues('<t4 type="meta" meta="last_modified" format="EEEE, MMMM d, yyyy" />'),
        contentId: getContentValues('<t4 type="meta" meta="content_id" />')

    };



         
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
    let openImageWrapper = '<div class="knowledgeImage col-xs-12 col-md-4">';
    let closeImageWrapper = '</div>';
    let openDescriptionWrapper = '<div class="descriptionWrapper col-xs-12 col-md-8">';
    let closeDescriptionWrapper = '</div>';




    /***
     *  Body wrapper funtion
     * 
     * */
    function processBodyWrapper() {

        openImageWrapper = '<div class="knowledgeImage d-none hidden visually-hidden">';
        openDescriptionWrapper = '<div class="descriptionWrapper col-xs-12 col-md-12">';
    }



    /***
     *  Set wrapper
     * 
     * */
    let beginningHTML = (knowledgeDict.articleTitle.content) ?
        '<article class="knowledgeArticle card border-start border-top-0 border-bottom-0 border-end-0" aria-label="' + knowledgeDict.articleTitle.content + '" id="ka' + knowledgeDict.contentId.content + '"><div class="knowledgeItem standardContent">' :
        '<article class="knowledgeArticle card border-start border-top-0 border-bottom-0 border-end-0" aria-label="' + knowledgeDict.contentName.content + '" id="ka' + knowledgeDict.contentId.content + '"><div class="knowledgeItem standardContent">' ;




    /***
     *  Description
     * 
     * */
    let descriptionString = (knowledgeDict.articleDescription.content) ?
        '<p class="articleDescription card-text">' + knowledgeDict.articleDescription.content + '</p>' :
        '<span class="articleDescription d-none hidden visually-hidden">No description entered</span>';




    /***
     *  Description
     * 
     * */
    let subtitleString = (knowledgeDict.articleSubtitle.content) ?
        '<p class="articleSubtitle card-text"><strong>' + knowledgeDict.articleSubtitle.content + '</strong></p>' :
        '<span class="articleSubtitle d-none hidden visually-hidden">No subtitle entered</span>';




    /***
     *  Description
     * 
     * */
    let linkString = (knowledgeDict.linkSource.content && knowledgeDict.linkText.content) ?
        '<p class="externalLink card-text"><a href="' + knowledgeDict.linkSource.content + '" class="card-link" title="Visit the site: ' + knowledgeDict.linkText.content + '" target="_blank">' + knowledgeDict.linkText.content + '</a></p>' :
        '<span class="externalLink d-none hidden visually-hidden">No link entered</span>';



    /***
     *  Format Last Modified
     * 
     * */
    let lastModifiedString = (knowledgeDict.lastModified.content) ?
          '<div class="lastModified"><p class="text-muted">Last Modified: <em>' + knowledgeDict.lastModified.content + '</em></p></div>' :
          '<span class="lastModified d-none hidden visually-hidden">No Last Modified Date Found</span>';




    /***
     *  Establish h3
     *  allow editors to hide the fulltext link when no full body exists
     * 
     * */
     let titleLink = (knowledgeDict.articleFullBody.content && knowledgeDict.fullTextLink.content && knowledgeDict.articleTitle.content) ?
        '<h1 class="card-title"><a href="' + knowledgeDict.fullTextLink.content + '" class="card-link" title="Read more about ' + knowledgeDict.articleTitle.content + '">' + knowledgeDict.articleTitle.content + '</a></h1>' :
        (knowledgeDict.articleTitle.content) ?
        '<h1 class="card-title">' + knowledgeDict.articleTitle.content + '</h1>' :
        '<h1 class="card-title">' + knowledgeDict.contentName.content + '</h1>';




    /***
     *  Process Media Library PDF File
     * 
     * */
     let mediaFileId = (knowledgeDict.mediaFile.content) ? content.get('Media File').getID() : null;
     let mediaFileString = (mediaFileId) ? mediaTag(mediaFileId) : '<span class="d-none hidden visually-hidden">No File Provided</span>';




    /***
     *  Process Image
     * 
     * */
    let imageFileId = (knowledgeDict.articleImage.content) ? content.get('Image').getID() : null;
    let imageMarkup = (imageFileId) ? imageTag(imageFileId) : null;
    let imageString = imageMarkup || '<span class="articleImage d-none hidden visually-hidden">No valid image provided</span>';
    if (!imageMarkup) { processBodyWrapper(); }





    /***
     *  Parse and format list items
     * 
     * */
    let topicString = (knowledgeDict.topics.content) ?
        assignList(knowledgeDict.topics.content) :
        '<span class="knowledgeBaseItem tags d-none hidden visually-hidden">No Topics Provided</span>';
     
    
    

    
    /***
     *  write document once
     * 
     * */
    writeDocument(
        [
            beginningHTML,
            openHeader,
            titleLink,
            closeHeader,
            openBody,
            openRow,
            openImageWrapper,
            imageString,
            closeImageWrapper,
            openDescriptionWrapper,
            linkString,
            subtitleString,
            descriptionString,
            closeDescriptionWrapper,
            closeRow,
            closeBody,
            openFooter,
            mediaFileString,
            topicString,
            lastModifiedString,
            closeFooter,
            endingHTML
        ]
    );
  
  
    
  
  } catch (err) {
    document.write(err.message);
  }
  