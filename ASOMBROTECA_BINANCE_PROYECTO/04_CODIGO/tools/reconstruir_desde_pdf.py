import pdfplumber, sys, json
pdf=pdfplumber.open(sys.argv[1]); out=sys.argv[2]
L=[]
for pi,p in enumerate(pdf.pages):
    for l in p.extract_text_lines(layout=False):
        L.append(dict(x0=l['x0'],x1=l['x1'],text=l['text'],page=pi,top=l['top'],chars=l['chars']))
# find page footers/headers: print tops distribution of first/last lines
def wordwidth(l):
    # width of first word (up to first space) of line
    cs=l['chars']; w=0; x=cs[0]['x0']
    for c in cs:
        if c['text']==' ': break
        w=c['x1']-x
    return w
res=[]; joins=[]
for i,l in enumerate(L):
    ind=max(0,round((l['x0']-72.0)/6.1))
    if res and abs(l['x0']-72.0)<0.6 and not l['text'].startswith(('//','(function','})','```')):
        prev=L[i-1]
        if prev['x1']+ 4 + wordwidth(l) > 523.5 and prev['x1']>380:
            joins.append((res[-1][-60:], l['text'][:40]))
            res[-1]=res[-1]+' '+l['text']; continue
    res.append(' '*ind+l['text'])
open(out,'w').write('\n'.join(res)+'\n')
json.dump(joins,open(out+'.joins.json','w'),ensure_ascii=False,indent=0)
print(len(L),len(res),len(joins))
