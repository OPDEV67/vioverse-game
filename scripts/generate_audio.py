"""Generate original Vioverse music and SFX using procedural synthesis.
No third-party samples. Output to assets/audio for GitHub Pages.
"""
import os, math, wave, subprocess
import numpy as np
SR=22050
OUT=os.path.join('assets','audio')
os.makedirs(OUT,exist_ok=True)
def midi(n): return 440*2**((n-69)/12)
def export(name,data):
 data=np.asarray(data,np.float32);peak=np.max(np.abs(data))
 if peak>.87:data*=.87/peak
 raw=(np.clip(data,-.97,.97)*32767).astype('<i2')
 wav=os.path.join(OUT,name+'.wav')
 with wave.open(wav,'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(raw.tobytes())
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',wav,'-codec:a','libmp3lame','-b:a','160k',os.path.join(OUT,name+'.mp3')],check=True)
 os.remove(wav)
def sound(freq,dur,style='bell'):
 t=np.arange(int(dur*SR),dtype=np.float32)/SR;p=2*np.pi*freq*t
 if style=='bell':a=(np.sin(p)+.33*np.sin(2.012*p)+.12*np.sin(4.04*p))*np.exp(-t*3.4)
 elif style=='harp':a=(np.sin(p)+.29*np.sin(2*p)+.14*np.sin(3*p))*np.exp(-t*4.8)
 elif style=='piano':a=(np.sin(p)+.21*np.sin(2*p)+.08*np.sin(3*p))*np.exp(-t*2.1)
 elif style=='strings':a=(np.sin(p)+.22*np.sin(2*p)+.09*np.sin(3*p))*(.85+.15*np.sin(2*np.pi*4.2*t))
 elif style=='pad':a=np.sin(p)+.22*np.sin(p*1.003)+.13*np.sin(2*p)
 else:a=np.sin(p)+.23*np.sin(2*p)
 return a
def mix_note(dst,start,note,dur,amp,style='bell',release=.4,attack=.012,pan=.5):
 pos=int(start*SR);count=min(len(dst)-pos,int((dur+release)*SR))
 if count<=0:return
 t=np.arange(count,dtype=np.float32)/SR
 a=sound(midi(note),(count+1)/SR,style)[:count]
 env=np.minimum(1,t/max(.001,attack))*np.exp(-np.maximum(0,t-dur)*4/max(.1,release))
 v=(a*env*amp).astype(np.float32)
 dst[pos:pos+count,0]+=v*(1-pan)*1.4
 dst[pos:pos+count,1]+=v*pan*1.4
def reverb(a):
 dry=a.copy()
 for sec,g in [(.14,.14),(.27,.11),(.41,.09),(.63,.07),(.83,.045)]:
  d=int(sec*SR);a[d:,0]+=g*dry[:-d,1];a[d:,1]+=g*dry[:-d,0]
 return a
# 16 bars at 72 BPM, ~53.3 seconds.
beat=60/72;bar=4*beat
chords=[(50,53,57,62),(46,50,53,58),(41,45,48,53),(48,52,55,60),(50,53,57,62),(43,46,50,55),(46,50,53,58),(45,49,52,57),(50,53,57,62),(46,50,53,58),(41,45,48,53),(48,52,55,60),(43,46,50,55),(46,50,53,58),(45,49,52,57),(50,53,57,62)]
melody=[[(0,74,1.5),(2,72,.75),(3,69,.9)],[(0,70,1),(1.5,69,.75),(2.5,65,1.3)],[(0,69,1.5),(2,72,.8),(3,77,.85)],[(0,76,1),(1.5,72,1),(3,67,.9)],[(0,74,.8),(1,77,.8),(2,76,.8),(3,74,.9)],[(0,70,1.5),(2,74,1),(3,70,.9)],[(0,72,1),(1,74,.8),(2,77,1.6)],[(0,76,.9),(1,73,.8),(2.5,69,1.2)],[(0,74,1.5),(2,72,.75),(3,69,.9)],[(0,70,1),(1.5,74,.75),(2.5,77,1.3)],[(0,81,1.5),(2,77,.8),(3,72,.85)],[(0,76,1),(1.5,72,1),(3,79,.9)],[(0,79,1),(1.5,77,.8),(2.5,74,1.2)],[(0,77,1),(1.5,74,1),(3,70,.9)],[(0,76,1),(1.5,73,1),(3,69,.9)],[(0,74,2.5),(3,69,.8)]]
length=16*bar;music=np.zeros((int(length*SR),2),np.float32)
for b,chord in enumerate(chords):
 t=b*bar
 for i,p in enumerate([0,2,1,3,1,2,0,2]):mix_note(music,t+i*beat/2,chord[p]+12,beat*.42,.045,'harp',.35,.004,.33)
 mix_note(music,t,chord[0]-12,beat*1.7,.07,'piano',.42,.013,.46)
 mix_note(music,t+beat*2,chord[1],beat*1.7,.065,'piano',.42,.013,.46)
 for p in chord[1:]:mix_note(music,t,p,bar*.96,.025,'strings',.35,.28,.61)
 for p in (chord[0],chord[2]):mix_note(music,t,p+12,bar*.96,.018,'pad',.6,.65,.48)
 for pos,n,d in melody[b]:mix_note(music,t+pos*beat,n,d*beat,.105,'bell',1.15,.006,.52)
music=reverb(music);fade=int(.75*SR);head=music[:fade].copy();tail=music[-fade:].copy();r=np.linspace(0,1,fade,dtype=np.float32)[:,None];music[:fade]=tail*(1-r)+head*r;music[-fade:]=music[-fade:]*(1-r)+head*r
export('vioverse-whispers-of-moonwood-theme',music*.78)
# Wind, leaves and distant magical forest bells.
rng=np.random.default_rng(2026);N=24*SR;t=np.arange(N)/SR
def smooth_noise(cutoff):
 n=rng.standard_normal(N).astype(np.float32)
 from scipy.signal import butter,sosfilt
 a=sosfilt(butter(3,cutoff,fs=SR,output='sos'),n);return a/max(np.std(a),1e-5)
a=smooth_noise(550)*.036*(.75+.25*np.sin(2*np.pi*t/8))
leaves=rng.standard_normal(N).astype(np.float32)
from scipy.signal import butter,sosfilt
leaves=sosfilt(butter(2,[1300,6000],btype='bandpass',fs=SR,output='sos'),leaves)
a+=leaves/max(np.std(leaves),1e-5)*.010*(.5+.5*np.sin(2*np.pi*t/5.2))
for pos,n in [(2.4,86),(8.7,83),(14.3,88),(19.6,84)]:
 x=sound(midi(n),1.8,'bell')*.011;p=int(pos*SR);a[p:p+len(x)]+=x
L=int(2*SR);r=np.linspace(0,1,L,dtype=np.float32);a[:L]=a[-L:]*(1-r)+a[:L]*r;a[-L:]=a[:L]
export('vioverse-forest-ambience',np.stack([a,np.roll(a,int(.043*SR))],axis=1))
effects={
 'vioverse-quest-completed':(2.5,[(0,74,1.1,.22),(.25,77,1.2,.21),(.53,81,1.5,.23),(.72,86,1.35,.14)]),
 'vioverse-level-up':(3.1,[(0,62,1,.13),(.2,69,1.2,.15),(.42,74,1.5,.21),(.7,77,1.5,.2),(1,81,1.8,.22),(1.3,86,1.6,.14)]),
 'vioverse-rare-discovery':(3.7,[(0,50,2.1,.13),(.45,57,2,.11),(.95,69,2,.11),(1.5,74,1.8,.16),(1.9,81,1.65,.23),(2.15,86,1.4,.13)]),
 'vioverse-friend-accepted':(2.3,[(0,74,1.2,.18),(.32,77,1.3,.19),(.65,81,1.45,.2),(.65,86,1.4,.14)])}
for name,(duration,notes) in effects.items():
 a=np.zeros((int(duration*SR),2),np.float32)
 for start,n,d,v in notes:mix_note(a,start,n,min(d*.7,duration-start-.1),v,'bell',d*.3,.004,.5)
 a=reverb(a);fade=int(.13*SR);a[-fade:]*=np.linspace(1,0,fade)[:,None]
 export(name,a)
print('Generated six original Vioverse MP3 files in',OUT)
