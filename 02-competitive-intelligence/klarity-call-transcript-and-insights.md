# Klarity — Sales Call Transcript + Insights

**Call:** Beam × Klarity Intro Call  
**Date:** Wed 20 May 2026  
**Duration:** 28 minutes  
**Participants:** Cory Pillow (Account Executive, Klarity) · Christian Engnath (Head of Operations, Beam)

---

## Executive summary for the team

We spoke to Klarity today. Key takeaway: **they are the most mature player in this space, their product is genuinely impressive, and their pricing ($15K pilot, six figures+ full contract) confirms that Beam cannot use Klarity as an off-the-shelf tool for clients.** This validates our hackathon project — the market clearly needs discovery tooling, and even the best incumbent doesn't close the discovery → agent spec gap.

**Partnership angle surfaced**: Cory explicitly suggested Klarity could be the frontline discovery layer, Beam the agentic rollout layer. Worth exploring after Friday — but not a dependency this week.

---

## Key insights for the hackathon

### 1. Pricing reality check
- Full deployment: "well north of six figures"
- Pilot: $15K for a 10-day sprint
- **Implication:** Beam cannot bundle Klarity into its client offering at normal margins. This makes our own discovery tool a business necessity, not just a nice-to-have. Use this in the Friday demo: *"We need this because the alternative costs six figures and doesn't output an agent spec."*

### 2. The adoption hill — getting people to click "start"
Cory said it plainly: *"The hill to climb is getting folks clicking the start companion button."* Their strategy: incentivise with personal strength insights (visible only to the individual first), anonymise everything, mandate via executive sponsor.
- **Implication for us:** Our interview-first approach (user initiates the session) sidesteps this cold-start problem. The user wants to share — they started the interview. This is a real differentiator to call out on Friday.

### 3. Enterprise adoption requires an executive champion
Cory: *"The AP team might not listen to the guy on the AI squad or to you, Christian. Getting CFOs and VPs to join kickoff sessions and encourage screen sharing has been hypercritical."*
- **Implication:** Our positioning should acknowledge this — our tool works best when the process owner initiates the discovery themselves, not when IT deploys a monitor on their machine.

### 4. Klarity explicitly does NOT close the discovery → agent gap
Cory mentioned their "agent building capabilities" but said: *"We probably don't need to dive too deep into some of that given you guys have those same types of capabilities."* They punt the agentic layer to partners.
- **This is our moat.** Every competitor stops at the process map. Beam's Discovery Agent outputs the agent blueprint. Make this the final moment of the Friday demo.

### 5. Their context graph structure — good design reference
Klarity structures captured data as: **Main node** (e.g., "Financial Close") → Level 1–5 processes, comparable to Lean Six Sigma black belt output. Steps have change logs (interview session vs. manual edit vs. screenshot).
- **Reference for our agent spec schema:** adopt a similar hierarchical structure. Our output should feel at least as structured.

### 6. LLM routing — they do it, we should mention it
Klarity dynamically routes to the best model per task: visuals → OpenAI, reasoning → Claude, etc. Configurable per client.
- **We should mention this in our demo** — show that we're model-agnostic and route to the best model. It's a proof point that we think at the same level of sophistication.

### 7. Klarity's Companion — their biggest differentiator vs. our approach
Companion is passive (browser-based, no install, just observes while you work for 6-8 hours/day). Anonymised, aggregated, no individual blame.
- **We don't have this.** Our approach is active (interview-driven). Both have pros/cons:
  - Passive: lower friction, but cold-start adoption problem, can't capture intent/why
  - Active: higher friction, but user is engaged, captures reasoning, outputs directly to agent spec
- **Frame this as a deliberate choice in the Friday pitch**, not a missing feature.

### 8. Privacy / Germany angle
Christian raised this: European users are extremely reluctant to share screen data. Klarity's answer is anonymisation + executive mandate.
- **Our answer:** the user initiates and controls the session. They're describing their own process, not being passively monitored. Much easier sell in GDPR-heavy markets.

---

## What Klarity does that we should match

| Capability | Their implementation | Our status |
|---|---|---|
| Structured process graph | Context graph with L1-L5 nodes + change logs | Flowchart nodes with confidence — ✓ partially |
| Per-step confidence | Not explicit | ✓ built in POC |
| Variance surfacing | Decision trees + Advisor queries | Partially (DECISION DETECTED labels) |
| Exportable flow diagrams | Visio, PNG, SFG | Not built — add to Stream 3 output |
| Executive summary generation | Via Advisor prompting | Agent spec covers this — Stream 3 |
| Change log / provenance | Shows interview vs manual edit | Not built — nice-to-have |

## What Klarity does that we deliberately don't need

| Capability | Why we skip it |
|---|---|
| Passive screen observation (Companion) | Too much infrastructure for 1.5 days; also philosophical difference |
| Multi-user parallel data collection | Not in scope for hackathon; could be a post-Friday roadmap item |
| Org-chart traversal / referral follow-up | Varos differentiator, not Klarity's — skip for now |

---

## Full transcript

```
0:00 | Cory
Hey, Christian. How are you?

0:03 | Christian
Hello? I am great. How are you?

0:07 | Cory
I'm doing well, happy Wednesday.

0:10 | Christian
You too. And thanks for moving this meeting around, which is way more helpful.

0:15 | Cory
Of course, not too late in the day for you, right?

0:19 | Christian
That's true. And the Monday is, I actually expected to be able to have that call. And then I was
just like overruled by, many meetings and never finding time to actually work. You know, how it is.
It's the same for all of us by the way. Quick question, as you are recording this session, would
it be possible to get this transcript or screening afterwards as well? Yeah, 100 percent amazing.
Perfect. Then I don't have to take notes.

0:45 | Cory
Great. I will put that in my follow up and make it easy.

0:48 | Christian
Perfect. That sounds amazing. How should we structure this session?

0:53 | Cory
Yeah, yeah. I was thinking we could do some quick introductions, would love to hear how you heard
about Klarity and what you're thinking from a project perspective, and then happy to just dive
right into the deck and educate you a bit more on who we are and what we do, and then can answer
questions along the way, if that sounds good to you?

1:09 | Christian
That sounds amazing. Let's do that. Should I quickly start and explain to you what beam actually
does? What is beam, I joined the company probably six weeks ago, running the entire operations
here including customer development and so on and so forth. What we are doing is basically
creating agentic networks for enterprises, basically automating their back office processes or
processes in financial services sectors… generally saying processes… that follow a high number of
tasks and cases that usually would land with bpo providers and companies… looking for AI solutions
now, or just large enterprises where they have a service… office somewhere in the world, processing
invoices in and out, having 50 people sitting there doing the same thing every single day.
Basically those tasks… we have customers all over the world. We are located in the main office in
Berlin. We're located in Berlin, Hamburg, New York, in Pakistan, in Dubai, and Australia, Sydney.
It's growing quickly. We are having challenges especially in the beginning. Therefore we are having
actually the call and why is it? So, and those enterprises we are talking about is like volkswagen,
Zurich insurance, like really large enterprises. Why is it? So as we're working with many different
clients, we always see that the beginning and the discovery phase is the most challenging one
because every single client is thinking, yes, I do know how my processes are at the moment.
Status quo is not a problem. So let's talk about the future, how it should look like. Turns out
every single time you're starting a project after a couple of weeks, people on both sides get
frustrated because actually the clarity is not existent. And therefore we started to look for
discovery tools since we need to focus our resources. I mean, at the end, we are people or 56
people in the team. So also not a huge organization. Therefore we need to focus with our resources
on the right things, the right things to create money or to earn money is basically building those
agents for our customers. Not necessarily the discovery phase. The discovery phase is needed to
enable us to create those agents. So we started our search for discovery tools that we could use
knowing that solutions are out there like celonis with process mining. The problem with process
mining is it only captures what is happening in systems and not in processes that is living in the
minds and heads of the people actually working with us processes, right? Who am I telling this?
If you're coming from this field, you know, the best, still what we did, the process that we are
currently are is basically, we got introduced for example, to ontora, they're currently in the y
combinator, it's a German team. So we got introduced looking into the solution, figuring out, okay,
this is not brand new. There are other companies out there. And our chief AI officer actually
mentioned you as a reference to say like, hey, why don't you look into this solution? Would be
quite nice. Maybe it's more helpful than a fresh company from scratch out of y combinator.
I'm not saying that they're good or bad. It's a brilliant team. They're super ambitious and so
on and so forth. But we are serving enterprise clients. So maybe a more advanced solution might
be the right way to go. Okay?

5:08 | Cory
Great. So really an ideal deployment of Klarity for your team would be to have Klarity serve as
the entry level discovery piece of understanding how work gets done for all of your clients. So
this wouldn't be an internal use case for you guys at beam. It's hey, I just signed on xyz client.
I need to understand how they do work. So then your team can go and deploy agents. And it sounds
like your really ROI that you're offering is like the offset of doing any type of BPM hiring a
bunch of folks offshore etc.

5:40 | Christian
Exactly. I would say that's the main use case, yes, confirmed the second. I mean, it's happening
along the way, right? So as we see it, it's like we go in and we need to talk to a complete
department, maybe having 50 people or 500 people, right? So having interviews and stuff is not
doable because we don't have the team and it's way too expensive. Second thing is, so this is
checkmark. Yes. It's the main use case. Second use case is we need to follow up constantly with
all our clients, whether… what we've built is meeting the expectations the moment the agents are
operating to get more input in… constantly means user feedback, right? On improvements and
whatsoever. So it will actually never stops. It needs to be more and more integrated along the
entire let's say delivery slash value chain we are implementing at our client set. Using this also
internally for us. Of course helps in the beginning. The pain point is more on the discovery
phase. I would say.

6:42 | Cory
Okay. Super helpful. And then in terms of the enterprise clients that you guys are typically
working with, how would you describe? Like, do you guys have a defined ideal customer persona
that you're typically going after?

6:58 | Christian
Yes and no, I would say if we're going verticalized, then for the financial sector, it's mostly
it's either the head of VP director or CFO. It's everything that is falling into the operational
finance departments… that is also applicable for banks as well as insurance companies. Then for
the other verticals, it's oftentimes it can be, or generally, it can also be pushed or pulled in
via the AI department. I mean, almost all of the enterprises have now AI departments although they
have it for some reason, they're not able to create what they actually want to have, which is fine.
That's the purpose we are there. So those are the two angles that are happening the most. And of
course, C level that is coming in and wants to explore, okay, setting up their agenda by saying,
like strategy department, setting up, hey, we need to automate. Now, our processes there's AI out
there and we're not using it. So, can you please help us?

8:09 | Cory
Makes a lot of sense. Yeah, it's interesting like some of the value prop that you guys are offering
around agents is similar to what we can offer to our customers as well. So I'm just trying to think
creatively around like this might in basic terms be more of like a partnership that we would be
talking about here. And it kind of sounds like what you're describing in general like you would use
us as the frontline discovery mechanism for like clients. And then you guys would continue to focus
on the tailored agentic rollout for whatever they need. So, yeah, happy to dive a bit deeper into
the solution. I didn't even introduce myself. I'm Corey, I'm a sales director here. Your request
was a little non standard to be honest just given your company is a lot smaller than some of our
typical businesses that we're working with. That being said, like we can talk about what that might
mean and see if there's anything here and go from there. So yeah, always love to have a good NASCAR
slide just highlighting different companies industries that we're working with. So software regulated
industries, industrials, kind of what I was talking about, Google is using us, openai, is using us.
ServiceNow is using us and then a number of the consulting firms too. And really the problem
statement that we have hyper focused in on is the work, the data layer for how work happens is
often happening in a silo, whether that's people process or systems. And you just mentioned Celonis,
right? It's going to sit on your screen and capture how that work gets done. But it's just what's
happening inside of your ERP, or just what's inside of your CRM. And you as you're hitting the
nail on the head have probably found, is it's really that off system work that comprises how work
actually gets done. And even if I sat on a two hour long interview trying to do discovery with you
on how your work gets done, there's a good chance that you're like not going to tell me the full
truth and not because you're intentionally lying, you just describe the happy path versus I'm
jumping to Slack or Teams consistently going back and forth between email and everyone's multitasking
so much to really comprise what a day to day looks like for each individual process. So what we're
working to accomplish is really becoming the context graph for companies. And I like to just think
about this as like the company brain of how things are done. So in this case, it would be for your
clients, right? Depending on what use case you guys step in at whether it's under the office of
the CFO, whether it's under the AI office, you could basically using our three part structure,
discover structure improve. And maybe we're really focused on discover here, deploy the AI companion
or the AI interviewer to have AI facilitate what that discovery phase would actually be. And what
this looks like with companion is it's basically a web application or a web browser. It just sits
on your browser. You don't have to install anything you click start companion. And it just watches
you do your work for six seven, eight hours a day without having to lift a finger. So folks really
like that. Maybe they're going through their financial close as the AP clerk. They just have their
companion session up and running in the background and it's going to observe how they do work. If
you wanted a very tailored and more structured version of this, you can do AI interviewer, which I
think about as like active current state capture. It's usually happening in shorter 15 to 30 minute
sprints where you could tailor the questions, Christian and say, hey, these are the exact questions
that this AP clerk needs to go answer. And then you'd actually chat back and forth with a bot to
kind of fill in the gaps on what a typical SOP would be. So deployment for us is usually go use
companion for a week or two to understand your current state and then fill in any gaps that you
might see with interviewer. Also bring in screenshots. If that's extremely relevant to you and your
team for the offerings that you're bringing to your clients. And then where this is all going is it
flows into the context graph like I was mentioning before. So this can be structured in whatever
realm makes the most sense. So like we were just running one with a client that started at the top,
the main node was like financial close. And then you kind of can list out your level one, level two
level three processes. And then what companion observes will start to feed into this context graph
from a level one through five perspective. Getting that type of granularity that a typical Lean Six
Sigma black belt would come in and be able to derive in a process index or in this case, a context
graph. The functionality that we'll have to figure out for you guys is we do, you know, it's always
sort of like, so what? Like great you captured my current state. Clients always want to take that
one step further. So we do also offer what we call our advisor agent. You can basically go into
advisor now that we understand your current state, query it on any questions that you might have,
so an objective might be we want to cut close times by one day or we need to drive efficiencies
across our AP process. Where are the bottlenecks, where are the gaps? Where are the variances? We
can surface all of that using our LLMs. And then we also do now have agent building capabilities,
but we probably don't need to dive too deep into some of that given you guys have those same types
of capabilities. So it really sounds like discovering and structuring a context graph for your
clients is likely the crux of what you would need in your offering.

13:39 | Christian
Question regarding the companion, did you fully develop it on your own, the companion or did you
implement it like a ready to go solution that is already existing in the market for a couple of
decades?

13:50 | Cory
We developed it on our own. Great question. Nice. Yeah, yeah, yeah. It's something the engineering
team is very proud of. And it actually started with the interviewer, and then we got the feedback
from our clients that, yeah, it's actually hard to ask folks to step away from their day jobs. And
even for 15 minutes, someone who's going through the close and tell them to capture their current
state. It's what every transformation person has experienced their entire career. Like no one wants
to talk to you. No one has time to talk to you. And as you're mentioning the calendar tetris of
even trying to find time to talk to somebody. So we ended up rolling out companion and we see it
to just be like exponentially better in every way. The back end of our tool is powered by general
large language models. So, you know, the OpenAIs, the Geminis the Anthropics of the world are all
on our back end along with some proprietary models. But we did develop companion, with the team we
have.

14:42 | Christian
Nice. Congrats and props. I mean, it's a lot I guess to actually set up and develop it, right?
And if you're thinking of the companies like Celonis, and so on with multi billion dollar valuations,
skyrocketing over the past decade is now getting basically getting replaced.

15:04 | Cory
A slide that you might find interesting because the next question that always comes up and you're
maybe less concerned about it because this is more for your clients but is security and privacy.
And everyone's like, we don't want some big brother monitor installed on everyone's desktops. I
don't know if you saw the news about Meta. They basically just rolled out tracking software on
everyone's computers to track down to the button click and they have no autonomy as employees to
basically decipher what it is that they're sharing and how they're sharing it. So we are taking a
different approach like your data is 100 percent yours. And if you are that AP clerk, everything
that you're doing while using companion will be completely anonymized. So no one will ever say,
OK, Bill did it this way. And Wendy did it this way. It's instead going to get aggregated under
that context graph, show you how the work is happening and where the variances lie without directly
pointing your finger at someone because you've got to find a way to incentivize the individual
contributors to want to turn something like this on without the fear that they're going to lose
their job or, you know, every CFO CEO C suite has a different type of mandate and it's not always
that everyone's jobs are going away, but a lot of times it's that everyone needs to level up with
the team. You know, what did you say? Your team's 56? Like I imagine you guys are being asked to
do a lot with a team of 56 and not always getting offered a bunch of additional heads.

16:21 | Christian
100 percent. And also from a management perspective, from my side, I don't want to create a
company with 500 people. It should be possible to do it below 100. At least. That's the dream.

16:34 | Cory
You would be by our CEO's best friend. He says that same thing all about like building exponential
organizations that can drive lean teams with insane productivity without having thousands of
employees because it's just frankly not necessary at this stage.

16:48 | Christian
Just can confirm that is a big dream. Let's see how far we get with that approach.

16:53 | Cory
It's been cool because we've been dogfooding our own product here at Klarity, and even just seeing
this come to life with our own data and then deploying agents on top of it, like the world is just
changing, really fast now.

17:11 | Christian
How many people you have in the company right now?

17:13 | Cory
We have a little under 200 right now, perfect size.

17:21 | Christian
Whatever I've seen in the past, like in my last company, I've been working at, it was like 6,000
people working for them.

17:28 | Cory
I was just talking to one of our biggest clients. McKesson, if you're familiar with like a Fortune
10 company. I mean, I think they have like over 60,000 employees and it's just a different world.

17:45 | Christian
Is, and it's so much more complex. Not because the work is complex. Yeah, people are complex and
they make it. For me, it's always more pleasant to work in a smaller company, like in the sweet
spot of up to 500 people. Maximum, whatever gets bigger, especially in the thousands, it's like
it's so inefficient.

18:07 | Cory
Well, I know we have 10 minutes. I figured I'd just give you a really quick snapshot visual and
if you're excited about this, we can schedule more time to dive a bit deeper. But let's start with
companion which I was mentioning. So it looks like this. I actually had already started a session.
You could basically resume that session. You can share up to two screens right now when you are
going through this and some folks are working on three screens just given everyone has an insane
amount of monitors. So now companion is on right? And I would just go about my day to day work.
I could open up my CRM, go navigate to LinkedIn, check out my Gmail, and basically companion is
going to follow me as I go through my day to day seeing how I do work. But again, I clicked a
button and now I just do my day to day. So that's companion, something else that's cool when
you're working in a companion session and this one was just getting going. So maybe I can open up
this one is you'll get an aggregate of signals that kind of indicate. And this is again to incentivize
individual contributors to want to share their work. That's saying, hey here's a personal strength.
You are, you know, value driven presentation, coaching with explicit methodology, balanced POC
readout combining advocacy with honest assessment. It basically knows that I'm a sales director
here at Klarity, because I described how I do my work and then using just general LLMs can say,
hey here's some areas that you really thrive, then I can choose as that individual contributor to
share these with my team. I could submit them to an admin. You absolutely don't have to again that
privacy aspect is there. But if you did want to share with an admin, you can aggregate these all
onto a team dashboard that looks something like this. So here's all the signals that I have
personally submitted to my team. But here's also the team signals. So I could see, you know, John
Carlyle on the alliances side is great at opportunity data entry, etc. So just different ways to be
thinking about incentivizing individual contributors because it is one of the honestly the hill to
climb is getting folks clicking the start companion button.

20:15 | Christian
True, yeah, especially in Germany and Europe. People are so hesitant to actually share anything
they do. It's ridiculous like you can improve so much and could be so much better. But everyone is
like, I don't want to share. I don't want to be seen. I want to hide.

20:38 | Cory
It'll be really important, like should we decide to partner together and press ahead — if you're
thinking through the rollouts with your clients, you'll need to be really closely partnered with
the business leaders of those teams. The AP team might not listen to the guy on the AI squad or
transformation team that's telling them to do this work, or might not listen to you, Christian,
that's saying turn this on every day while you do their work. So getting that partnership with the
CFOs, with the VPs of those organizations to join those kickoff sessions and encourage people to
just start sharing their screen, knowing that they have complete protection over their data has
just been really hypercritical across the board.

21:38 | Christian
We need somebody who has really some influence on the other side basically to push it in and to
make people aware of that. This is a high priority topic and then they have to collaborate.

21:49 | Cory
Right, exactly. I won't get into the interviewer today. We can always dive a bit deeper on this
later, but you could basically tailor these questions. I could then send this out directly to Bob
on that team to capture his current state process under a particular node. But all of this rolls
into that context graph or process index I was mentioning. And it looks something like this. If
I was focused on the lead to quote value chain or the delivery lifecycle value chain, you kind of
get all of that data aggregated here. And then you can see it on the step by step level. So here
is just an inbound lead qualification kind of re-imagined SOP of how that work actually happens.
You get the step by step listed out here. I can actually see that this information was aggregated
through two interview sessions as well as some manual edits. So you have all the change logs there
with you. You can capture an update. This is kind of what I was talking about. Folks usually deploy
companion and then they'll fill in the gaps with a live walkthrough that can have those screenshots
if you will. And then you can always generate documents. I find those large organizations just
can't get over how badly they want an SOP or a BRD of how work gets done. So if that's a
necessity, we can do that too. Folks can kind of walk through process flow diagrams here and it's
all about that discovery phase, having proper documentation about how that work actually is getting
done.

23:07 | Christian
And one question of curiosity, how is the system basically surfacing contrary opinions or workflows?

23:17 | Cory
Yes, great question. So I'll see if I could just find this — might be a bad example. So, if there's
a variance in a process there'll be like a decision tree listed out in the steps. But what's even
more impactful is if you actually go to advisor — under advisor, I could then say, okay, I'm looking
at my lead to quote process and inbound lead qualification process. Like we were mentioning, you
could then say, where are the variances in my inbound lead qualification process? So this is
operating more like your typical way that you would prompt ChatGPT, Claude etc. You put any type
of prompt in here. This is obviously not a very technical prompt. You can get much more granular,
much more detailed while this one's running. I'll come back out and just pull up some of what I
have already created. So in this case, I was asking create a current state and future state diagram
of our order to cash process. I understand how I can cut close times by two days, create a 30-60-90
day roadmap on my rollout. So, you know, it was able to quickly generate those process flow
diagrams. These can be exported to Visio, PNG, SFG which is also super important to particular
business teams, and then what that future state might be able to look like. And then you get that
executive summary. So you can realistically cut month-end close by two days instead of doing,
you know, end of month batching to daily driven execution, and then get even more granular on
exactly what that step by step needs to look like.

25:07 | Christian
Nice. Thanks a lot. That really helps. And great to see the advisor side. That is super helpful…
especially on the advisor side if you're prompting, you're interacting and so on and so forth.
I assume. Or how do you handle this in terms of different LLMs to probably below that. And do you,
are you using the same LLM for the advisor or are you constantly switching or is the user actually
able to switch the LLMs that are used?

25:38 | Cory
It is constantly switching to whichever best in class LLM makes the most sense for what you're
asking. So as you've probably seen like certain models are much better at visuals. So if I'm
generating a process flow diagram, maybe I'm not using Claude, but instead I'm using OpenAI and
kind of like doing that context switching for you. If for whatever reason, you guys have limitations
on your end, like OpenAI is a customer, right? And they demanded that we only use OpenAI models.
Makes a lot of sense. It is an expensive decision to make, but we can also configure those decisions
too.

26:13 | Christian
That's basically the background of my question. It's like if you ask an enterprise before they see,
let's say the invoice at the end of the month, they would say, of course, I want to have a Claude
4.7 working for me the entire time because it's the most intelligent one creating the most content
as well. So therefore we need to process a lot of content and data, right? So what people mostly
over the hand forget is that there are great models out there which are more or less for free or
cost fraction of the latest ones and they're serving or solving the request even better sometimes.

26:45 | Cory
Yes. Our Eng team is like constantly trying to optimize our token burn down on different large
language models, but also ensure our clients are getting best in class for whatever that prompt
might be.

27:02 | Cory
The only thing I did want to be transparent about is, you know, a lot of times customers are
spending like well north of six figures and you guys are obviously a leaner team. So not that I
wanted to disqualify you guys on price. I just wanted to make sure we were on the same page to
sort of progress over to the next step. So this isn't really like it's not a $10,000–$20,000
investment. It is much higher than that, but we would certainly want to partner together and make
sure we can create the right ROI for you guys to make the business case up the chain.

27:32 | Christian
Oh, that makes absolute sense. And thanks for being so open about that. I would say let's take
that with me, discuss it also internally and think of a use case that may be also practical for
you. I mean not creating more work but less work. And if we basically have using it internally for
us and we find a model basically to implement it easily that you don't have that much work and
start in a trial. I'm just thinking out loud right now.

28:09 | Cory
We offer a 10 day pilot. It's very short sprint just given you can accomplish so much. So, maybe
the homework to be done here, Christian is, if you can think of a client that you might want to
use as a test case, it could either be work that you guys are already doing in parallel and we
could show how that's accelerated or again, whatever makes the most sense for you guys. It's
typically a paid pilot period for about $15K. We pay $15K, do that 10 day sprint, prove the value
to you guys of what would be able to be achieved. And then we could talk bigger, badder, better
contracts.

28:41 | Christian
Nice. Sounds good. Okay. Great. Well.

28:43 | Cory
I'll cut you loose. I'll send you this recording so you have it as well as the deck and you can
socialize internally.

28:48 | Christian
Amazing. Thanks a lot for that. Have a wonderful day ahead and talk to you soon.

28:52 | Cory
You too. Thanks Christian.

28:53 | Christian
Bye, thank you. Bye.
```

---

## Call recap (auto-generated)

**Participants:** Cory Pillow (AE, Klarity) · Christian Engnath (Head of Ops, Beam)

**Klarity's pitch to Beam:** Use Klarity as the entry-level discovery layer for Beam's enterprise clients. Beam focuses on agentic rollout; Klarity handles discovery. Partnership framing.

**Beam's confirmed pain points:**
- Discovery phase is the biggest challenge in every client engagement
- Clients believe they understand their own processes — they don't
- Can't run individual interviews at scale (50–500 person departments)
- Process mining (Celonis) only captures system activity, not human activity

**Agreed next steps:**
- Cory to send recording + deck
- Christian to discuss pricing internally and identify a pilot test case
- $15K paid pilot for a 10-day sprint — one client as test case
- Follow-up call if Christian wants to go deeper
