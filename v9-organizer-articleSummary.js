  /***
*     @author Victor Chimenti, MSCS-SE '20
*     @file v9-organizer-articleSummary.js
*     v9/organizer/articleSummary
*
*     This new content type is a hybrid being adapted from the knowledge base
*     content type used by IT Services and the News type available to all departments.
*     It is intended to provide a searchable, sortable group of articles that can be
*     exported to and used by any department when they need a summary and image to
*     align responsively in an organizer layout.
*
*     This content type will work in conjunction with the Organizer and each item
*     will contain one searchable, article.
*
*     Document will write once when the page loads
*
*     @version 4.5
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
    var lastModified = '<div class="lastModified" style="display:inline-block"><p>Last modified: <t4 type="meta" meta="last_modified" format="MMMM d, yyyy" /></p></div>'; 
    var titleLink = "";
    var thumbNailString = "";
  
  
    /**
     * Fields reserved for full text layout:
     * 
     *    var featureImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Thumbnail image' output='normal' formatter='path/*' />");
     *    var altFeatureImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Alt Feature Image' output='normal' modifiers='striptags,htmlentities' />");
     *
     */
  
  
    /* -- Prepare all the things -- */
    var beginningHTML = '<div class="newsItemWrapper" id="id<t4 type=\'meta\' meta=\'content_id\' />"><div class="newsItem standardContent">';
    var endingHTML = '</div></div>';
  
  
  
    /* determine which link, if any, goes in the title */
    if (articleFullBody == "") {
        titleLink = "<h2>" + articleTitle + "</h2>";
    } else {
        titleLink = '<h2><a href="' + fullTextLink + '">' + articleTitle + '</a></h2>';
    }
  
  
    /* determine which link, if any, goes on the image */
    if (externalLink == "") {
        thumbNailString = '<div class="newsImage"><img src="' + thumbnailImage + '" class="articleImage" alt="' + altThumbnailImage + '" /></div>';
    } else {
        thumbNailString = '<div class="newsImage"><a href="' + externalLink + '" target="_blank"><img src="' + thumbnailImage + '" class="articleImage" alt="' + altThumbnailImage + '" /></a></div>';
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
  