---
layout: post
title: "Deploy via FTP"
date: 2012-05-11 14:21
comments: true
categories: [Tips, FTP, Octopress]
---

My web hosting is a low-cost one and doesn't provide a SSH access.
I can't use Octopress' deployment methods, only FTP.

Tired of drag-and-dropping my files in FileZilla, I decided to use `lftp`.

In `Rakefile`, add:

``` ruby
## -- LFTP Deploy config -- ##
ftp_user       = "login"
ftp_password   = "password"
ftp_server     = "server"
ftp_target     = "/remote/path/to/blog"
deploy_default = "lftp"
```

and:

``` ruby
desc "Deploy website via LFTP"
task :lftp do
  puts "## Deploying website via LFTP"
  ok_failed system("lftp -e 'mirror -R -v #{public_dir} #{ftp_target}; bye' -u #{ftp_user},#{ftp_password} #{ftp_server}")
end
```

Now, I can `rake deploy`!

Note: if you don't want to put your password in the Rakefile, use:
``` ruby
desc "Deploy website via LFTP"
task :lftp do
  puts "## Deploying website via LFTP"
  ok_failed system("lftp -e 'mirror -R -v #{public_dir} #{ftp_target}; bye' -u #{ftp_user} #{ftp_server}")
end
```
and `lftp` will nicely ask for your password.
