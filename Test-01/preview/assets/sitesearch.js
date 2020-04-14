/*! 
 * $Id: sitesearch.js 68509 2018-11-05 12:12:29Z sseiz $
 * Copyright Zeta Software GmbH
 */
$z(document).ready(function () {
	function hideLabel(theField){
		// Check for HTML5-Fieldtypes which fill the field with widgets, so the placeholder text isn't visible
		var fieldsWithoutPlaceholder = ["date","time","color"];
		var fieldType = $z(theField).attr("type");
		if ( fieldsWithoutPlaceholder.indexOf(fieldType) !== -1 ){  
			// current field type was found in array of field types we want to ignore
			// check if the browser supports the current field type and if so, return false so we don't hide the label
			var i = document.createElement("input");
			i.setAttribute("type", fieldType);
			if (i.type !== "text"){
				return false;
			}	
		}
		
		if ( $z(theField).attr("placeholder") !== "" && $z(theField).attr("placeholder") !== undefined ){
			// placeholder attribute is set, so we hide the label
			return true;
		}
		return false;
	}
	
	$z(".SO-SiteSearchForm.autohidelabels").each(function(){
		var theForm = $z(this);
		// show placeholders if JS is on (we had hidden them in CSS to not show both, labels and placeholders
		theForm.addClass("placeholder");
		// hide labels of empty fields
		theForm.find("input.typetext, textarea").filter(function() { return $z(this).val() == ""; }).each(function(){
			if ( $z.support.placeholder && hideLabel($z(this)) ){
				$z(this).parent().addClass("nolabel");
			}
		});
		// when something is typed into an input text field or when it is being emtied, show the label again
		theForm.find("input.typetext, textarea").off("keyup");
		theForm.find("input.typetext, textarea").on("keyup", function(){
			if( $z(this).val() !== "" ){
				$z(this).parent().removeClass("nolabel");
			}
			else{
				$z(this).parent().addClass("nolabel");
			}
		});
		theForm.find("input.typetext, textarea").off("blur");
		theForm.find("input.typetext, textarea").on("blur", function(){
			if( $z(this).val() !== "" ){
				$z(this).parent().removeClass("nolabel");
			}
			else{
				$z(this).parent().addClass("nolabel");
			}
		})
	});
});