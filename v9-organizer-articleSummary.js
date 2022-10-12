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
*     @version 5.1.5
*/

try {
    /* -- Assign all the things -- */
    var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />"); 
    var thumbnailImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Thumbnail image' output='normal' formatter='path/*' />");
    var altThumbnailImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Alt Image' output='normal' modifiers='striptags,htmlentities' />");
    var articleSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Summary' output='normal' display_field='value' />");
    var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Full Article' output='normal' display_field='value' />");
    var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' use-element='true' filename-element='External Link' modifiers='striptags,htmlentities' />");
    var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    var contentID = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='content_id' />");
    var lastModified = '<div class="lastModified" style="display:inline-block"><p>Last modified: <t4 type="meta" meta="last_modified" format="MMMM d, yyyy" /></p></div>'; 
    var titleLink = "";
    var thumbNailString = "";

  
  
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
        thumbNailString = '<div class="knowledgeImage"><img src="' + thumbnailImage + '" class="articleImage" alt="' + altThumbnailImage + '" /></div>';
    } else {
        thumbNailString = '<div class="knowledgeImage"><a href="' + externalLink + '" target="_blank"><img src="' + thumbnailImage + '" class="articleImage" alt="' + altThumbnailImage + '" /></a></div>';
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
  