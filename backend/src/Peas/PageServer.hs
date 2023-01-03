{-# language DataKinds #-}
{-# language OverloadedStrings #-}

module Peas.PageServer where

import Servant

import Lucid ( Html, body_, content_, doctypehtml_
             , head_, href_, link_, meta_, name_
             , rel_, script_, src_, title_, div_, id_
             , style_ , charset_)
import Servant.HTML.Lucid       (HTML)

import Control.Monad.Reader

type PageEndpoint
  = Get '[HTML] (Html ())
  :<|> ("assets" :> Raw)

pageEndpointHandler :: Server PageEndpoint
pageEndpointHandler
  = return page
  :<|> serveDirectoryFileServer "../public"

-- test :: Maybe a -> Maybe a
-- test h = _

page :: Html ()
page = doctypehtml_ $ do
  head_ $ do
    title_ "R.A.P.S"
    meta_ [ name_ "viewport", content_ "width=device-width, initial-scale=1" ]
    link_ [ rel_ "stylesheet" , href_ "assets/style.css" ]
  body_ $ do
    div_ [ id_ "root"] ""
    script_ [ src_ "assets/app.js" ] ("" :: String)
