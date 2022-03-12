# Account Labeler Extension

**This is an early prototype.**

A browser extension that uses Govdirectory to label accounts belonging to a government agency on various social media platforms.

## Building the extension.

*You only need to build the extension if you want to update the underlying account data.*

To build this extension, you will need to have an installation of the [Govdirectory website](https://github.com/govdirectory/website).

First, ensure that your Govdirectory-website is up-to-date, then run `snowman cache --unused --invalidate` in your website directory.

Now you can navigate to the root of this project and run the following(replace the path with the actual path to your website directory):

```
python scripts/generate-account-labels.py --location ~/projects/govdirectory/website/
```

This should generate a new `account_data.js` file which you can copy into the extension directory.
