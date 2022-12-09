{-# language DataKinds #-}
{-# language OverloadedStrings #-}

module Peas.PageServer where

import Servant

import Lucid (Html, body_, content_, doctypehtml_,
               head_, href_, link_, meta_, name_,
               rel_, script_, src_, title_, div_, id_)
import Servant.HTML.Lucid       (HTML)       

type PageEndpoint
  = Get '[HTML] (Html ())
  :<|> ("assets" :> Raw)

pageEndpointHandler :: Server PageEndpoint
pageEndpointHandler
  = return page
  :<|> serveDirectoryFileServer "../public"

page :: Html ()
page = doctypehtml_ $ do
  head_ $ do
    title_ "Example Servant-Elm App"
    meta_ [ name_ "viewport"
          , content_ "width=device-width, initial-scale=1" ]
    link_ [ rel_ "stylesheet"
          , href_ "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
          ]
    script_ [ src_ "assets/app.js" ] ("" :: String)
  body_ $ do
    div_ [ id_ "elm-app"] ""
    script_ "var app = Elm.Main.init({ node: document.getElementById('elm-app')});"
