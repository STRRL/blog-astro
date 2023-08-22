---
title: "2023-08: Global Game Jam"
date: 2023-02-06T21:05:29+08:00
lastmod: 2023-02-06T21:05:29+08:00
keywords: []
description: ""
tags:
- 生活
- Daily Life
categories:
- 周报
- Weekly Report
author: ""

---


## Overview

The weekly report is from January 31st to February 21th, 2023.

I decided to write the weekly report series in English because I want to improve my English skill. Not just for writing but primarily for getting familiar with English words and phrases.

That's also why I delayed this blog for a few weeks. I was using Grammarly when I wrote the blog, and spent too much time embellishing it. At last, I gave up writing the blog in the Grammarly editor and only used it to check the content after I completed the writing.

I participated in the English Club several times in the last three weeks. My English corpus is too small to respond to others' questions: I have to construct in my brain for a while, search vocabulary for what I want to express, then I can finally speak it out if I still do not forget what the opinion I origin wish to say.

## Professional Stuff

### Standard Bug Set

I found an exciting code repo on GitHub: [jkoppel/QuixBugs](https://github.com/jkoppel/QuixBugs). It introduces some common one-line bugs for some classic algorithms in both java and python. Compared to asking the interviewee to write algorithm codes from scratch, it might be a better way to inspect the professional skills and experiences.

I noticed this repo by some news about ChatGPT which said that ChatGPT could resolve many cases in the given repo.

Also, a tweeter has tried to interview ChatGPT for a junior developer job: <https://twitter.com/zanmato1984/status/1623638722167336960>. In conclusion, ChatGPT would not get hired, but it knows a lot about computer architecture and the operating system.

### Trivial Issues after Exchanging Harddisk between PCs

As the highly anticipated new game (Hogwarts Legacy) was released, my girlfriend asked me to exchange the graphic cards for a smoother game experience. Her gaming PC set was i5-9600F with RTX 2070, and mine was i7-11700 with RTX 3080.

I once supposed it was just a straightforward case about exchanging graphic cards, but I was totally wrong. 😅

After exchanging graphic cards, her computer failed to run any game, including the Hogwarts Legacy and the Monster Hunter Rise. The computer just got powered off and then restarted. We thought that it might be caused by the graphic driver. So we updated the nvidia driver to the latest version, but it did not work. I opened the windows event viewer and found that there was no critical software log at all. Then I realized that it might be the power issue: RTX3080 requires more power than RTX2070. In common sense, the 80 series always requires more power than the 70 series. I opened the performance overlay to monitor the power consumption. I noticed during the loading scene and shader compiling phase the power of graphic cards did not exceed over 80 watts, which means the graphic card did not engage. Once it was about to enter the main scene, the PC got powered off. I also tried that with the non-game software 3DMarks, and it could be reproduced easily.

I inspected our PCs' power supplies: hers got 550w, and mine got 850w, and both were modular. So I started to exchange power supplies between PCs. Changing the power supply is not as easy as changing the graphic card: I need to open another side of the back panel, unscrew about 4 screws, poll all the clamped cables out from the plug, and finally reconnect them with the new one. I exchanged them and then packed the PC case confidentially without giving it a test. I connected the power cable and opened the switch, but the computer did not boot. I tried on another PC, and both of them did not work. Even the lights on the motherboard were not on.

I had no idea about this circumstance, and I asked friends. They told me that different models of modular power supplies have different cable sequences, so the cable might not be adaptable.

I recognized I needed to use the power supply and cable in pairs. But dismounting the power cable from the case would be complicated because I had to unravel all cables bound on the backside and tidy and tie them again in the new place.

Finally, I decided to change nothing but only harddisks between PCs. My computer got 3 SSDs, one of which was mounted on a PCIE extension card; hers had 2 SSDs plus one SATA HDD. It's still a complicated thing to be done.

Anyway, exchanging harddisks resolved the original demand: my girlfriend got a better game experience on Hogwarts Legacy, except for one thing: her Windows lost the activation after changing the hardware, and I forgot the production keys. 🥲

I will NOT DIY a new gaming PC again in the future. Upgrading and trivial adaptation issues would make me crazy.

## Personal Stuff

### Global Game Jam

The Global Game Jam 2023 is held from February 3rd to February 5th, and the theme of this GGJ is "Roots."

It was my first time participating in the GGJ, and I asked some college friends to play together.

One week ago, I proposed an idea about Tower Defence Game but played with VR. We brainstormed about the expected products and found that making it on a 2-days jam was viable.

The origin design of the game contains 2 major gameplays:

- TPS on position fixed tower
- Tower Defence with a 45-degree top view

We finished the gameplay design before the theme was released, so we have also prepared to only modify the art style to accustom the theme.

We uploaded a video about the gameplay demonstration: [bilibili](https://www.bilibili.com/video/BV1gx4y1777b).

### Diablo 3 Season 28 PTR

Diablo 3 Season 28 will be open the following Friday, February 24th. I played in the PTR server to early access the new changes, the new season theme of Season 28.

There was a severe bug in the PTR for the Demon Hunter: the set "Natalya's Vengeance" had an unexpected interaction with the set "Shadow's Mantle," and the damage would be increased by 6000% with a melee weapon. So everyone could rush the Great Rift 150 with a melee weapon and the 5+2 build mentioned above.

And there is an overpowered buff that could be abused by any class. When the player uses a potion, gain a random shrine or the Dimensional Power pylon effect. If we are lucky enough, we could get the power of Conduit/Lighting continuously and rush the Great Rift 150 in about 3 minutes.

And one skill of Necromancer could reduce the cooldown of the potion, which means we could use the potion more frequently.

But in the official updates of Season 28 later, the player could no longer gain the Conduit pylon by the potion. Only random shrines and "Power" with a duration of 16 seconds would be available.

### Start using Shared Library in Apple Photos

My girlfriend and I have established the apple family sharing for a long time, but we forgot to set up the "Shared Library." Several weeks ago, we found that we have many photos of each other but do not have them ourselves. So we take a long time to manually share the pictures by Airdrop and share albums.

Soon, we found that photos could be shared **automatically** by "Shared Library": when we activate the "share" as taking the picture, it appears in both of our Photo applications. That's really convenient!

### Panoramic Camera: Insta 360 X3

I brought a panoramic camera Insta 360 X3, on the day near the new year. I am so excited about it. It could take 360-degree videos and photos without nearly any post-processing. I could look around **after** I took the picture.

I took panoramic videos of our house, tourism, and hiking with my girlfriend. We can always find funny stuff when we review the videos.

But the quality of the video is not good enough, even though it is already recorded in 5.7K or 8K. The viewpoint is blurred when I look around. It looks like a 360p video.

The video file size is so huge: I could only take about 9 hours of video with a 512GB SD card. It takes about two times the video content duration to export the video from insta private format to MP4, and it takes another 2 times to upload the video to youtube.

## Other

I was still working on preparing for the language test. My original plan is to memorize vocabulary first, after completing half of the word lists, then take the simulation test. I am not sure I should take a  course for the TOEFL test.

I have been eager(also anxious) for the next phase because I did not take the simulation test before and have no idea what the exam could be. I have completed about 1600 to 4300 words now, about 38%. It still requires one more week to move into the next phase.

Many other things are worth recording, but I would not postpone this blog anymore. New content about "Healthier breakfast and sleep habits," "Itasha Car," "Tourism in Beijing and Tianjin," and "Panoramic Times-clasp Videos" will come up in the next blog.
