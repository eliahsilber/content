<?php 
	if (!function_exists('isDevelopmentServer')){
		function isDevelopmentServer()
		{
			return get_cfg_var('ZP_IS_DEVELOPMENT_SERVER')==='1';
		}
	}
 	if (!function_exists('isProductionServer')){
		function isProductionServer()
		{
			return !isDevelopmentServer();
		}
	}
	if (!function_exists('hidePhpWidget')){
		function hidePhpWidget($showInInternalPreview=false, $showInExternalPreview=false)
		{
			$hideme = false;	
			if ( 'false'=='true' && $showInInternalPreview==false ){
				$hideme = true;
			}
			else if( isDevelopmentServer() && 'false'=='false' && $showInExternalPreview==false ){
				$hideme = true;
			}
			return $hideme;
		}
	}
?>
<?php 
if ( !hidePhpWidget(false, false) ){
ob_start(); 
$displayPagePassword = '11bvc'; $areaName = 'Geschützter Bereich'; $areaTitle = '';
$pageUrl ='https://hosting.zeta-producer.com/6612317808/test.php';
$siteUrl ='https://hosting.zeta-producer.com/6612317808';
$h=parse_url($siteUrl, PHP_URL_HOST); 
$p=parse_url($siteUrl, PHP_URL_PATH); 
$prefix = 'www.'; 
if (substr(strtolower($h), 0, strlen($prefix)) == $prefix) { 
    $h = '.' . substr($h, strlen($prefix)); 
} 
if (empty($p)) { 
	$p = '/'; 
} 
if (!empty($h)) { 
	session_set_cookie_params(0, $p, $h); 
} 
if(!isset($_SESSION)){session_start();} 
require_once(dirname($_SERVER['SCRIPT_FILENAME']) . '/' . 'assets/php/pa/pa.main.php');
}
?>
<!DOCTYPE HTML>
<html class="no-js responsivelayout" lang="de" data-zpdebug="false" data-ptr="">
<head>
	<script>
		document.documentElement.className = document.documentElement.className.replace(/no-js/g, 'js');
	</script>
	
	<title>Test</title>
	
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="description" content="" />
	<meta name="keywords" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="generator" content="Zeta Producer 15.3.0.0, ZP15F, 06.04.2020 19:08:02" />
	<meta name="robots" content="index, follow" />
	
	
	
	
	<script>
		// if after 1000ms we haven't got webfonts, show the user something, a FOUT is better than nothing
		// http://kevindew.me/post/47052453532/a-fallback-for-when-google-web-font-loader-fails
		setTimeout(function() {
			// you can have the webfont.js cached but still have no classes fire and you will have a window.WebFontConfig object
			if ( ! ("WebFont" in window)) {
				// non wfl loader class name because their events could still fire
				document.getElementsByTagName("html")[0].className += " wf-fail";
			}
		}, 1000);
	
		WebFontConfig = {
			google: { families: [ 'Roboto:300,400,700' ] }
		};
	</script>
	<script src="assets/js/webfont/1.6.28/webfont.js"></script>

	<noscript>
		<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Roboto:300,400,700" />
	</noscript>
	
	<link rel="stylesheet" type="text/css" href="assets/bundle.css?v=637224005846803940" />
<link rel="stylesheet" type="text/css" href="assets/bundle-print.css?v=637224004111813315" media="print" />

	

	 
	
	<script type="text/javascript" src="assets/bundle.js?v=637224005846803940"></script>
	
	<!-- Search Inline Script -->
	
	
	<!-- RSS -->
	
	
	
	
	
</head>

<body id="locus-responsive" class="notouch nologo">
	
	<a id="top"></a>
	
	
	<!-- Teaser "Banner" -->
	

	<!-- Logo -->
	
			
	<div id="wrapper" class="container">
		<!-- Header -->
		<div id="header">
			
			<div class="topline" >
				<div id="webdescription">
					<!-- Webname -->
					
						<div id="webtext" 
>
							<div id="webname"><a href="index.html">Cotta-Abizeitung</a></div>
							
								<div id="slogan">Jahrgang 2021</div>
							
						</div>
					
					
				</div>
			</div>
			
			<div id="nav">
				
					<ul class="zpmarkactive default submenu touchhovermenu clickhovermenu out" data-trianglemode="true"><li class="zpnodefaults"><a href="index.html">Startseite</a></li><li class="zpnodefaults"><a href="kontakt.html">Kontakt</a></li><li class="zpnodefaults"><a href="impressum.html">Impressum</a></li><li class="overflownonly"><a href="#" id="mobilenavtoggle" class="tabletonly toggle" aria-label="Menü ein-/ausblenden">&#9776; Menü</a></li></ul>

<script>
$z(document).ready(function(){
	// we find the active page's a-tag and then walk upwards the dom marking the respective parent li as active/open
	$z('ul.zpmarkactive.default li a.active').parents('li').each(function(index){
		var that = this;
		// do not add open class to immediate parent li
		if ( index > 0 ){
			$z(that).addClass('open');
		}
		$z(that).addClass('active');
		//$z(that).find('> a').addClass('active');
	});
	$z("ul.zpmarkactive.default").removeClass("zpmarkactive");
	
	/*
	$z("ul.zpmarkactive.default li:has(a.active)").addClass("active");
	$z("ul.zpmarkactive.default li.haschilds > a").addClass("haschilds");
	$z("ul.zpmarkactive.default li.haschilds:has(a.active)").addClass("active");
	$z("ul.zpmarkactive.default li.active > a").addClass("active");
	
	$z("ul.zpmarkactive.default").removeClass("zpmarkactive")
	*/
});
</script>
				
			</div>
		</div>

			
			
		<div id="content" class="main style1 rounded" >
			 
				
			

<div class="zparea zpgrid" data-numcolumns="" data-areaname="Standard" data-pageid="553">
	
			<div id="container_133" class="zpContainer first last  " 
				 data-zpeleel="container" data-zpleid="133">
			
		
					
					<div class="zpRow standard  " data-row-id="219" 
						
					>
		
					
						<div class="zpColumn odd zpColumnWidth1 c12 first last" style=" " data-column-id="237" 
							
						>
			
							
<div class="zpColumnItem" >
	<div id="a1556" data-article-id="1556" data-zpleid="1556" 
 class="articlearea zpwGesch-tzter_Bereich" 
	
	>
	

	

	
	

<?php if ( hidePhpWidget(false, false) ) { ?>
	

	<div class="zpieInfobox" style="margin-bottom: 30px; padding: 15px; border: 2px solid rgba(54,171,87,1.0); color: #333333; background-color: rgba(54,171,87,0.43);">
		Hinweis: Der Artikel &quot;<strong>Geschützter Bereich</strong>&quot; 
		
			kann erst in der Live-Version auf dem Webserver angezeigt werden.
		
	</div>

	<!-- 
<?php } ?>



<?php
    $reqver = '5.3.0';
    $curver = phpversion();
    if (strnatcmp($curver,$reqver) < 0)
    {
        echo( "<p style='color:red; background-color: yellow; font-size:larger'>Bitte aktualisieren Sie PHP auf Version <b>$reqver</b> (zurzeit: $curver). <a href='http://zeta.li/zp-php-version-check-failed'>Info</a></p>" );
    }
?>

		
		<?php
			if ( !hidePhpWidget(false, false) ){
			 //$uiUrl = $siteUrl . "/assets/js/jqueryui/jquery-ui-1.12.1.custom.min.js";
			 echo '<script src="' . $siteUrl . "/ass" . "ets/php/pa/etc/jquery/jquery-ui-1.9.2.custom.min.js" . '"></script>';
			 echo '<div style="padding:0 10px 10px 0; position:fixed; bottom:0; right:0; z-index:9999;"><input type="button" id="paLogout" class="button" onClick="javascript:window.location = \'?action=palogout\'; return false;" value="Abmelden"  title="Von diesem Bereich abmelden" /></div><script>$z( "#paLogout" ).button();</script>';
			}
		?>
		
	
<?php if ( hidePhpWidget(false, false) ) { ?>
-->
<?php } ?>

	
		 
	

	</div>
</div>


<div class="zpColumnItem" >
	<div id="a1555" data-article-id="1555" data-zpleid="1555" 
 class="articlearea zpwText" 
	
	>
	
	
			

	<h2 
	
	  data-zpfieldname="headline">Test</h2>

			


Platzieren Sie hier Ihre eigenen Texte und Bilder. Bearbeiten Sie diesen Text einfach durch einen Doppelklick.


	

	</div>
</div>


			
						</div>
			
						

					</div><!-- .zpRow -->
				
		
				</div><!-- close container -->
	
		
	
</div> <!-- .zparea -->


		</div>
		
		

	</div>
	
	
	
	
	<div id="footer" class="container">
		

	<div id="xmenu" class="" 
>
		
		
			<a class="xmenulink" href="index.html">Startseite</a>
		
			<a class="xmenulink" href="kontakt.html">Kontakt</a>
		
			<a class="xmenulink" href="impressum.html">Impressum</a>
		
			
			
		
	</div>


		
		<div id="copyright" 
>
			
				© 



2020 Cotta-Abizeitung. 
			
			
				<a href="https://www.zeta-producer.com" class="zp">Website erstellt mit Zeta Producer CMS</a>
			
		</div>
		
	</div>
	
	
	<script>	
		function setoverflown(){
			if ( $z("#nav").is(":hover") || ! $z("#nav > ul > li").length ){
				return;
			}
			if ( $z("#nav:not(.on)").overflown() ){
				$z("#nav > ul").css("text-align", "left");
				$z("#nav, #nav > ul li.overflownonly").addClass("overflown");
				// hide overflown list items
				var firstTop = $z("#nav > ul > li").eq(0).position().top;
				$z("#nav > ul > li").each(function(){
					if ( $z(this).position().top > firstTop ){
						$z(this).addClass("overflowing");
					}
				});
			}
			else{
				$z("#nav > ul").css("text-align", "");
				$z("#nav, #nav > ul li.overflownonly").removeClass("overflown");
				// re show previously hidden, overflowing li
				$z("#nav > ul > li").removeClass("overflowing");
			}
		}
		
		$z(document).ready(function(){
			// switches the Mobile Navigation-Menu on/off, when "Menu" link is clicked.
			$z("a#mobilenavtoggle").on("click", function(e){
				e.preventDefault();
				if ( $z("#nav").hasClass("on") ){
					// we're switching to off now
					$z("#nav ul li").removeClass("hoverToClickMenuAdded clicked");
					$z("#nav ul ul").css("display", "").css("visibility", "");
				}
				$z("#nav").toggleClass("on");
			});	
			
			setoverflown();
			var resizeTimeout = null;
			$z(window).resize(function() {
				if (resizeTimeout) {
					clearTimeout(resizeTimeout);
				}
				// throttle the resize event
				resizeTimeout = setTimeout(function () {
					setoverflown();
				},150);
			});
		});
		
		$z(window).on('load', function(){
			setoverflown();
			setTimeout(function(){setoverflown();}, 1000);
		});
	</script>

	

	
<!-- {{{ -->
<!--
* Layout: Locus Responsive by StS
* $Id: default.html 81066 2019-11-04 12:00:50Z sseiz $
-->
<!-- }}} -->
</body>
</html>